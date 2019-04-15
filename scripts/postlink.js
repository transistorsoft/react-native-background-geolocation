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

////
// Android
// 1. Add maven url
//     maven {
//         url "$rootDir/../node_modules/react-native-background-geolocation/android/libs"
//     }
// 2. Add googlePlayServicesLocationVersion ext var.
//
const androidSrcDir = path.join(projectDirectory, 'android');
const projectGradleFile = path.join(androidSrcDir, 'build.gradle');
const moduleName = moduleDirectory.split('/').pop();
const pluginGradleFile = path.join(projectDirectory, 'node_modules', moduleName, "android", "build.gradle");

const mavenUrl = [
    '\t\tmaven {',
    '\t\t\turl "$rootDir/../node_modules/' + moduleName + '/android/libs"',
    '\t\t}',
].join("\n");

const repositoriesRE = new RegExp("(allprojects\\s?\\{\\n[\\s?\\t]+repositories\\s?\\{)", "gm");
const moduleRE = new RegExp(moduleName + "\\/android", "gm");
const extRE = new RegExp("(buildscript\\s?\\{\\n[\\t\\s]+ext\\s+\\{)", "gm");

const googlePlayServicesLocationVersionRE = new RegExp("googlePlayServicesLocationVersion", "gm");
const defaultGooglePlayServicesLocationVersionRE = new RegExp('DEFAULT_GOOGLE_PLAY_SERVICES_LOCATION_VERSION\\s+=\\s+"([0-9\\.]+)"');

var googlePlayServicesLocationVersion = null;

// First read DEFAULT_GOOGLE_PLAY_SERVICES_LOCATION_VERSION from plugin's build.gradle.
try {
    var data = fs.readFileSync(pluginGradleFile, 'utf8');
    if (!defaultGooglePlayServicesLocationVersionRE.test(data)) {
        return console.log("[" + moduleName + "] FAILED TO READ DEFAULT_GOOGLE_PLAY_SERVICES_LOCATION_VERSION");
    }
    var m = data.match(defaultGooglePlayServicesLocationVersionRE);
    googlePlayServicesLocationVersion = m[1];
} catch(e) {
    console.log("[" + moduleName + "] FAILED TO OPEN FILE: " + pluginGradleFile);
};

// Open project build.gradle.  Add maven tslocationmanager maven url.
fs.readFile(projectGradleFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  if (moduleRE.test(data)) {
      return;
  }
  if (!repositoriesRE.test(data)) {
      console.error("[" + moduleName + "] FAILED TO LINK MAVEN URL in android/build.gradle");
      console.error("Ensure your android/build.gradle contains the following maven url:");
      console.error("allprojects {\n\trepositories {\n" + mavenUrl + "\n\t}\n}");

      return;
  }
  // Write maven url.
  data = data.replace(repositoriesRE, "$1\n" + mavenUrl);

  // Write googlePlayServicesLocationVersion
  if ((googlePlayServicesLocationVersion != null) && extRE.test(data)) {
      if (!googlePlayServicesLocationVersionRE.test(data)) {
          data = data.replace(extRE, '$1\n\t\tgooglePlayServicesLocationVersion = "' + googlePlayServicesLocationVersion + '"', "gm");
      }
  }
  fs.writeFile(projectGradleFile, data, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});

// Add purge debug sounds method.
const appGradleFile = path.join(androidSrcDir, 'app', 'build.gradle');
const purgeMethodName = "purgeBackgroundGeolocationDebugResources";
const purgeScript = [
    '// [Added by react-native-background-geolocation] Purge debug sounds from release build.',
    'def ' + purgeMethodName + '(applicationVariants) {',
    '    if ((rootProject.ext.has("removeBackgroundGeolocationDebugSoundsInRelease")) && (rootProject.ext.removeBackgroundGeolocationDebugSoundsInRelease == false)) return',
    '    applicationVariants.all { variant ->',
    '        if (variant.buildType.name == "release") {',
    '            println("[react-native-background-geolocation] Purging debug resources in release build")',
    '            variant.mergeResources.doLast {',
    '                delete(fileTree(dir: variant.mergeResources.outputDir, includes: ["raw_tslocationmanager*"]))',
    '            }',
    '        }',
    '    }',
    '}'
].join("\n");

fs.readFile(appGradleFile, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    var purgeMethodRE = new RegExp("^[\\s\\t]+" + purgeMethodName + "\\(applicationVariants\\)", "gm");

    // Add purge-method executor if not exists.
    if (!data.match(purgeMethodRE)) {
        var re = /(android\s?\{\s?\n)/gm;
        if (re.test(data)) {
            data = data.replace(re, "$1\t" + purgeMethodName + "(applicationVariants)\n");
        }
    }
    // Declare purge-method if not exists.
    purgeMethodRE = new RegExp("^def\\s+" + purgeMethodName, "gm");
    if (!data.match(purgeMethodRE)) {
        data += "\n" + purgeScript;
    }

    fs.writeFile(appGradleFile, data, 'utf8', function (err) {
        if (err) return console.log(err);
    });

});

