import {
  ConfigPlugin,
} from "@expo/config-plugins";

import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

type Props = {}

export const withBackgroundGeolocationPluginIos: ConfigPlugin<Props> = (config, props={}) => {
  // Nothing to here here currently, but left for future considerations.
  return config;
};

export default withBackgroundGeolocationPluginIos;
