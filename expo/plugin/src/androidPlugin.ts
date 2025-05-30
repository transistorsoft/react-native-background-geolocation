import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  withProjectBuildGradle,
  withAppBuildGradle,
  withAndroidManifest,
  withDangerousMod
} from '@expo/config-plugins';

import {
  mergeContents,
  removeContents,
} from "@expo/config-plugins/build/utils/generateCode";


type Props = {
  license?: string,
  hmsLicense?: string,
  polygonLicense?: string
}

import path from 'path';
import fs from 'fs';

const PUBLIC_MODULE = 'react-native-background-geolocation';
const PRIVATE_MODULE = PUBLIC_MODULE + '-android';

const META_LICENSE_KEY = "com.transistorsoft.locationmanager.license";
const META_HMS_LICENSE_KEY = "com.transistorsoft.locationmanager.hms.license";
const META_POLYGON_LICENSE_KEY = "com.transistorsoft.locationmanager.polygon.license";

const findModuleRecursively = (dir: string): string | null => {
  const nodeModules = path.resolve(dir, 'node_modules');
  if (fs.existsSync(path.join(nodeModules, PUBLIC_MODULE))) {
    return PUBLIC_MODULE;
  }
  if (fs.existsSync(path.join(nodeModules, PRIVATE_MODULE))) {
    return PRIVATE_MODULE;
  }

  const parent = path.resolve(dir, '..');
  if (parent === dir) {
    // we have reached the root of the file system -> not found
    return null;
  }

  return findModuleRecursively(parent);
};
const MODULE_NAME = findModuleRecursively(path.resolve('.'));
if (!MODULE_NAME) {
  console.error(`Could not find neither '${PUBLIC_MODULE}' or '${PRIVATE_MODULE}' in node_modules`);
  process.exit(1);
}

const { 
  addMetaDataItemToMainApplication, 
  removeMetaDataItemFromMainApplication,
  getMainApplicationOrThrow 
} = AndroidConfig.Manifest;


const androidPlugin: ConfigPlugin<Props> = (config, props={}) => {
  config = withProjectBuildGradle(config, ({ modResults, ...subConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withBackgroundGeolocation',
        `Cannot automatically configure project build.gradle if it's not groovy`,
      );
      return { modResults, ...subConfig };
    }

    modResults.contents = applyMavenUrl(modResults.contents);

    return { modResults, ...subConfig };
  });

  config = withAppBuildGradle(config, ({ modResults, ...subConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withBackgroundGeolocation',
        `Cannot automatically configure project build.gradle if it's not groovy`,
      );
      return { modResults, ...subConfig };
    }

    modResults.contents = applyAppGradle(modResults.contents);

    return { modResults, ...subConfig };
  });

  config = withAndroidManifest(config, async (config) => {

    console.log("[react-native-background-geolocation] Adding license-keys to AndroidManifest:", props);

    const mainApplication = getMainApplicationOrThrow(config.modResults);

    addMetaDataItemToMainApplication(
      mainApplication,
      META_LICENSE_KEY,
      props.license || "UNDEFINED"
    );
    if (props.hmsLicense) {
      addMetaDataItemToMainApplication(
        mainApplication,
        META_HMS_LICENSE_KEY,
        props.hmsLicense
      );
    } else {
      removeMetaDataItemFromMainApplication(
        mainApplication,
        META_HMS_LICENSE_KEY
      );
    }
    if (props.polygonLicense) {
      addMetaDataItemToMainApplication(
        mainApplication,
        META_POLYGON_LICENSE_KEY,
        props.polygonLicense
      );
    } else {
      removeMetaDataItemFromMainApplication(
        mainApplication,
        META_POLYGON_LICENSE_KEY
      );
    }
    return config;

  });

  return config;
};

const applyAppGradle = (buildGradle:string) => {
  // Apply background-geolocation.gradle
  const newSrc = [];

  newSrc.push(`Project background_geolocation = project(':${MODULE_NAME}')`)
  newSrc.push(`apply from: "\${background_geolocation.projectDir}/app.gradle"`)

  buildGradle = mergeContents({
    tag: `${MODULE_NAME}-project`,
    src: buildGradle,
    newSrc: newSrc.join("\n"),
    anchor: /android\s\{/,
    offset: -1,
    comment: "//",
  }).contents;

  return buildGradle;

}

/**
 * DISABLED in favour of gradle.properties
 *
const applyExtVars = (buildGradle: string, props:Props) => {

  const newSrc = [];

  const ext = props.ext;
  if (ext) {
    for (let [key, value] of ext) {
      if (typeof(value) === 'boolean') {
        newSrc.push(`\t${key} = ${value}`)
      } else {
        newSrc.push(`\t${key} = "${value}"`)
      }
    }
  }

  return mergeContents({
    tag: `${MODULE_NAME}-ext`,
    src: buildGradle,
    newSrc: newSrc.join("\n"),
    anchor: /ext(?:\s+)?\{/,
    offset: 1,
    comment: "//",
  }).contents;
}
*/

const applyMavenUrl = (buildGradle: string):string => {
  return mergeContents({
    tag: `${MODULE_NAME}-maven`,
    src: buildGradle,
    newSrc: `\tmaven { url "\${project(":${MODULE_NAME}").projectDir}/libs" }\n\tmaven { url 'https://developer.huawei.com/repo/' }`,
    anchor: /maven\s\{/,
    offset: 1,
    comment: "//",
  }).contents;
}

export default androidPlugin;

