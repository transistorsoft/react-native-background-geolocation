const path = require('path');
const fs = require('fs');
const glob = require('glob');
// unfortunately we can't use the 'plist' module at the moment for parsing
// because it has a few issues with empty strings and keys.
// There are several issues and PRs on that repository open though and hopefully
// we can revert back to only using one module once they're merged.
const plistParser = require('fast-plist');
const plistWriter = require('plist');

// The getBuildProperty method of the 'xcode' project is a bit naive in that it
// doesn't take a specific target but iterates over all of them and doesn't have
// an exit condition if a property has been found.
// Which in the case of react-native projects usually is the tvOS target because
// it comes last.
function getBuildProperty(project, property) {
    const firstTarget = project.getFirstTarget().firstTarget;
    const configurationList = project.pbxXCConfigurationList()[
        firstTarget.buildConfigurationList
    ];
    const defaultBuildConfiguration = configurationList.buildConfigurations.reduce(
        (acc, config) => {
            const buildSection = project.pbxXCBuildConfigurationSection()[
                config.value
            ];
            return buildSection.name ===
                configurationList.defaultConfigurationName
                ? buildSection
                : acc;
        },
        configurationList.buildConfigurations[0]
    );

    return defaultBuildConfiguration.buildSettings[property];
}

function getPlistPath(sourceDir, project) {
    const plistFile = getBuildProperty(project, 'INFOPLIST_FILE');
    if (!plistFile) {
        return null;
    }
    return path.join(
        sourceDir,
        plistFile.replace(/"/g, '').replace('$(SRCROOT)', '')
    );
}

function readPlist(sourceDir, project) {
    const plistPath = getPlistPath(sourceDir, project);
    if (!plistPath || !fs.existsSync(plistPath)) {
        return null;
    }
    return plistParser.parse(fs.readFileSync(plistPath, 'utf-8'));
}

function writePlist(sourceDir, project, plist) {
    fs.writeFileSync(
        getPlistPath(sourceDir, project),
        plistWriter.build(plist)
    );
}

// based on: https://github.com/facebook/react-native/blob/545072b/local-cli/link/ios/mapHeaderSearchPaths.js#L5
function eachBuildConfiguration(project, predicate, callback) {
    const config = project.pbxXCBuildConfigurationSection();
    Object.keys(config)
        .filter(ref => ref.indexOf('_comment') === -1)
        .filter(ref => predicate(config[ref]))
        .forEach(ref => callback(config[ref]));
}

// this is being used to determine whether the current target is a react-native
// project: https://github.com/facebook/react-native/blob/545072b/local-cli/link/ios/mapHeaderSearchPaths.js#L31
function hasLCPlusPlus(config) {
    return (config.buildSettings.OTHER_LDFLAGS || []).indexOf('"-lc++"') >= 0;
}

// based on: https://github.com/facebook/react-native/blob/1490ab1/local-cli/core/ios/findProject.js
function findProject(folder) {
    const GLOB_PATTERN = '**/*.xcodeproj';
    const TEST_PROJECTS = /test|example|sample/i;
    const IOS_BASE = 'ios';
    const GLOB_EXCLUDE_PATTERN = ['**/@(Pods|node_modules)/**'];

    const projects = glob
        .sync(GLOB_PATTERN, {
            cwd: folder,
            ignore: GLOB_EXCLUDE_PATTERN,
        })
        .filter(project => {
            return path.dirname(project) === IOS_BASE || !TEST_PROJECTS.test(project);
        })
        .sort((projectA, projectB) => {
            return path.dirname(projectA) === IOS_BASE ? -1 : 1;
        });
  
    if (projects.length === 0) {
        return null;
    }
  
    return projects[0];
};

function addToFrameworkSearchPaths(project, path, recursive) {
    eachBuildConfiguration(project, hasLCPlusPlus, config => {
        if (!config.buildSettings.FRAMEWORK_SEARCH_PATHS) {
            config.buildSettings.FRAMEWORK_SEARCH_PATHS = [];
        } else if (typeof config.buildSettings.FRAMEWORK_SEARCH_PATHS === 'string') {
            config.buildSettings.FRAMEWORK_SEARCH_PATHS = [config.buildSettings.FRAMEWORK_SEARCH_PATHS];
        }
        const fullPath = '"' + path + (recursive ? '/**' : '') + '"';

        if (
            config.buildSettings.FRAMEWORK_SEARCH_PATHS.indexOf(fullPath) === -1
        ) {
            config.buildSettings.FRAMEWORK_SEARCH_PATHS = config.buildSettings.FRAMEWORK_SEARCH_PATHS.concat(
                fullPath
            );
        }
    });
}

function removeFromFrameworkSearchPaths(project, path) {
    eachBuildConfiguration(project, hasLCPlusPlus, config => {
        if (!config.buildSettings.FRAMEWORK_SEARCH_PATHS) {
            config.buildSettings.FRAMEWORK_SEARCH_PATHS = [];
        } else if (typeof config.buildSettings.FRAMEWORK_SEARCH_PATHS === 'string') {
            config.buildSettings.FRAMEWORK_SEARCH_PATHS = [config.buildSettings.FRAMEWORK_SEARCH_PATHS];
        }

        const fullPath = unquote(path) + '/**';

        config.buildSettings.FRAMEWORK_SEARCH_PATHS = config.buildSettings.FRAMEWORK_SEARCH_PATHS.filter(
            searchPath =>
                unquote(searchPath) !== unquote(path) &&
                unquote(searchPath) !== fullPath
        );
    });
}

// The node-xcode library doesn't offer a method to get all target attributes,
// so we'll have to implement it ourselves.
function getTargetAttributes(project, target) {
    var attributes = project.getFirstProject()['firstProject']['attributes'];
    target = target || project.getFirstTarget();

    if (attributes['TargetAttributes'] === undefined) {
        attributes['TargetAttributes'] = {};
    }

    if (attributes['TargetAttributes'][target.uuid] === undefined) {
        attributes['TargetAttributes'][target.uuid] = {};
    }

    return attributes['TargetAttributes'][target.uuid];
}

function unquote(str) {
    return (str || '').replace(/^"(.*)"$/, '$1');
}

module.exports = {
    getBuildProperty: getBuildProperty,
    getPlistPath: getPlistPath,
    readPlist: readPlist,
    writePlist: writePlist,
    getTargetAttributes: getTargetAttributes,
    addToFrameworkSearchPaths: addToFrameworkSearchPaths,
    removeFromFrameworkSearchPaths: removeFromFrameworkSearchPaths,
    findProject: findProject,
};
