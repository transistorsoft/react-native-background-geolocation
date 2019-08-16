#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const xcode = require('xcode');
const PbxFile = require('xcode/lib/pbxFile');
const helpers = require('./xcode-helpers');

const projectDirectory = process.cwd();
const moduleDirectory = path.resolve(__dirname, '..');

////
// iOS
//
const sourceDirectory = path.join(projectDirectory, 'ios');
const xcodeProjectDirectory = helpers.findProject(sourceDirectory);

const projectConfig = {
    sourceDir: sourceDirectory,
    pbxprojPath: path.join(
        projectDirectory,
        'ios',
        xcodeProjectDirectory,
        'project.pbxproj'
    ),
};

const pathToFramework = path.relative(
    projectConfig.sourceDir,
    path.join(
        moduleDirectory,
        'ios',
        'RNBackgroundGeolocation',
        'TSLocationManager.framework'
    )
);


const project = xcode.project(projectConfig.pbxprojPath).parseSync();

/**
 * There is a method in node-xcode that offers similar functionality than what
 * is implemented below `addFramework` (https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L300)
 * but unfortunately it won't work for our use-case because there are two other
 * methods in node-xcode that are being used by `addFramework` that don't work
 * as expected:
 * 1 `addToFrameworksPbxGroup` fails if no group with the name "Frameworks" exists
 *  https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L641
 *  - https://github.com/alunny/node-xcode/issues/43
 *  - this issue could be worked around by just checking if the group exists and
 *    creating it if it doesn't exist before executing `addFramework`
 * 2 `addToFrameworkSearchPaths` doesn't work with react-native:
 *  https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L1125
 *  - https://github.com/alunny/node-xcode/issues/91
 *  - https://github.com/alunny/node-xcode/pull/99
 *  - the issue there is that https://github.com/alunny/node-xcode/blob/ffb938b/lib/pbxProject.js#L1133
 *    in react-native projects the "PRODUCT_NAME" is "$(TARGET_NAME)", so it won't
 *    be visited by this method.
 *    And even if the name would be correct it still wouldn't work correctly for
 *    react-native projects, because not all targets should get the library added
 *    for example: react-native creates *tests and *tvOs and *tvOstests targets.
 */
const file = new PbxFile(pathToFramework);
file.uuid = project.generateUuid();
file.fileRef = project.generateUuid();
file.path = pathToFramework;
file.target = project.getFirstTarget().uuid;

if (!project.hasFile(file.path)) {
    project.addToPbxBuildFileSection(file);
    project.addToPbxFileReferenceSection(file);
    // addToFrameworksPbxGroup crashes when it can't find a group named "Frameworks"
    if (!project.pbxGroupByName('Frameworks')) {
        project.addPbxGroup([], 'Frameworks');
    }
    project.addToFrameworksPbxGroup(file);
    project.addToPbxFrameworksBuildPhase(file);
}

// Is this a Cocoapods installation?
const podFile = path.join(sourceDirectory, 'Podfile');
const hasPodfile = fs.existsSync(podFile);
if (!hasPodfile) {
    // Only add FRAMEWORK_SEARCH_PATHS for non-Cocoapod installation
    helpers.addToFrameworkSearchPaths(
        project,
        '$(PROJECT_DIR)/' +
        path.relative(
            projectConfig.sourceDir,
            path.join(moduleDirectory, 'ios')
        ),
        true
    );
} else {
    helpers.addToFrameworkSearchPaths(
        project,
        '$(inherited)',
        false
    );
}


// enable BackgroundModes in xcode project without overriding any previously
// defined values in the project file.
// That's why we deep clone all previously defined target attributes and extend
// them with our target attributes.
const targetAttributes = helpers.getTargetAttributes(project);
const systemCapabilities = Object.assign({}, (targetAttributes.SystemCapabilities || {}), {
    'com.apple.BackgroundModes': Object.assign(
        {},
        targetAttributes['com.apple.BackgroundModes'] || {},
        { enabled: true }
    ),
});
if (targetAttributes.SystemCapabilities) {
    targetAttributes.SystemCapabilities = systemCapabilities;
} else {
    project.addTargetAttribute('SystemCapabilities', systemCapabilities);
}

// add "location" background mode to Info.plist file
const plist = helpers.readPlist(projectConfig.sourceDir, project);
const UIBackgroundModes = plist.UIBackgroundModes || [];
if (UIBackgroundModes.indexOf('location') === -1) {
    plist.UIBackgroundModes = UIBackgroundModes.concat('location');
}

// Add NSLocationAlwaysUsageDescription
if (!plist.NSLocationAlwaysUsageDescription) {
    plist.NSLocationAlwaysUsageDescription = "CHANGEME: Location Always Usage Description";
}

// Add NSLocationAlwaysAndWhenInUseUsageDescription
if (!plist.NSLocationAlwaysAndWhenInUseUsageDescription) {
    plist.NSLocationAlwaysAndWhenInUseUsageDescription = "CHANGEME: Location Always And When In Use Usage Description";
}

// Add NSMotionUsageDescription
if (!plist.NSMotionUsageDescription) {
    plist.NSMotionUsageDescription = "CHANGEME: Motion updates increase battery efficiency by intelligently toggling location-services when device is detected to be moving";
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());


