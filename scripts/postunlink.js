#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const xcode = require('xcode');
const PbxFile = require('xcode/lib/pbxFile');
const helpers = require('./xcode-helpers');

const projectDirectory = process.cwd();
const moduleDirectory = path.resolve(__dirname, '..');
const sourceDirectory = path.join(projectDirectory, 'ios');

function findPbxprojFile( directory ) {
    const files = fs.readdirSync(directory);
    for (let i = files.length - 1; i >= 0; i--) {
        const fileName = files[i];
        const ext = path.extname(fileName);

        if (ext === '.xcodeproj') {
            return path.join(directory, fileName, 'project.pbxproj');
        }
    }

    return null;
}

const projectConfig = {
    sourceDir: sourceDirectory,
    pbxprojPath: findPbxprojFile( sourceDirectory )
};


const pathToFramework = path.relative(
    projectConfig.sourceDir,
    path.join(
        moduleDirectory,
        'ios',
        'RNBackgroundFetch',
        'TSLocationManager.framework'
    )
);

const project = xcode.project(projectConfig.pbxprojPath).parseSync();

const file = new PbxFile(pathToFramework);
file.target = project.getFirstTarget().uuid;

project.removeFromPbxBuildFileSection(file);
project.removeFromPbxFileReferenceSection(file);
if (project.pbxGroupByName('Frameworks')) {
    project.removeFromFrameworksPbxGroup(file);
}
project.removeFromPbxFrameworksBuildPhase(file);

helpers.removeFromFrameworkSearchPaths(
    project,
    '$(PROJECT_DIR)/' +
    path.relative(
        projectConfig.sourceDir,
        path.join(moduleDirectory, 'ios')
    )
);

// disable BackgroundModes and remove "fetch" mode from plist file
const systemCapabilities = helpers.getTargetAttributes(project).SystemCapabilities;
if (systemCapabilities && systemCapabilities['com.apple.BackgroundModes']) {
    delete systemCapabilities['com.apple.BackgroundModes'].enabled;
    if (Object.keys(systemCapabilities['com.apple.BackgroundModes']).length === 0) {
        delete systemCapabilities['com.apple.BackgroundModes'];
    }

    if (Object.keys(systemCapabilities).length === 0) {
        project.removeTargetAttribute('SystemCapabilities');
    }
}

const plist = helpers.readPlist(projectConfig.sourceDir, project);
if (Array.isArray(plist.UIBackgroundModes)) {
    plist.UIBackgroundModes = plist.UIBackgroundModes.filter(
        mode => mode !== 'location'
    );
    if (plist.UIBackgroundModes.length === 0) {
        delete plist.UIBackgroundModes;
    }
}

helpers.writePlist(projectConfig.sourceDir, project, plist);
fs.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
