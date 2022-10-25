import { ConfigPlugin, withPlugins } from '@expo/config-plugins';

import androidPlugin from './androidPlugin';
import iOSPlugin from './iOSPlugin';

const withBackgroundGeolocation: ConfigPlugin<
  {
    //ext?:Map<string,string|boolean>
    /**
     * Default ""
     */
    license?: string
  } | void
> = (config, _props) => {
  const props = _props || {};

  return withPlugins(config, [
    [androidPlugin, {
      license: props.license
    }],
    [iOSPlugin, {
      // no props for ios currently.
    }]
  ]);
};

export default withBackgroundGeolocation;
