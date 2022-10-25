import {
  ConfigPlugin,
  withAppDelegate,
  withEntitlementsPlist,
  withInfoPlist
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

const LOCATION_ALWAYS_AND_WHEN_IN_USE_USAGE_DESCRIPTION = "[CHANGEME] LocationAlwaysAndWhenInUseUsageDescription";
const LOCATION_WHEN_IN_IN_USE_USAGE_DESCRTIPION = "[CHANGEME] LocationWhenInUseUsageDescription";
const MOTION_USAGE_DESCRIPTION = "[CHANGEME] NSMotionUsageDescription";

const ensureKey = (arr: string[], key: string) => {
  if (!arr.find((mode) => mode === key)) {
    arr.push(key);
  }
  return arr;
}

type Props = {
	NSLocationAlwaysAndWhenInUseUsageDescription?:string
  NSLocationWhenInUseUsageDescription?:string
  NSMotionUsageDescription?:string
}

export const withBackgroundGeolocationPluginIos: ConfigPlugin<Props> = (config, props={}) => {
  config = applyInfoPlist(config, props);

  return config;
};

/**
 * Append `UIBackgroundModes` to the `Info.plist`.
 */
export const applyInfoPlist: ConfigPlugin<Props> = (c, props) => {
  return withInfoPlist(c, (config) => {
    if (!Array.isArray(config.modResults.UIBackgroundModes)) {
      config.modResults.UIBackgroundModes = [];
    }

    // Apply background-modes.
	  config.modResults.UIBackgroundModes = ensureKey(
	    config.modResults.UIBackgroundModes,
	    "location"
	  );

    // Apply usage-descriptions.
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      props.NSLocationAlwaysAndWhenInUseUsageDescription || LOCATION_ALWAYS_AND_WHEN_IN_USE_USAGE_DESCRIPTION

    config.modResults.NSLocationWhenInUseUsageDescription =
      props.NSLocationWhenInUseUsageDescription || LOCATION_WHEN_IN_IN_USE_USAGE_DESCRTIPION

    config.modResults.NSMotionUsageDescription =
      props.NSMotionUsageDescription || MOTION_USAGE_DESCRIPTION

    return config;
  });
};


export default withBackgroundGeolocationPluginIos;
