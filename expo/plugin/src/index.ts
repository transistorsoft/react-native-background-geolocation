import { ConfigPlugin, withPlugins } from '@expo/config-plugins';

import androidPlugin from './androidPlugin';
import iOSPlugin from './iOSPlugin';

const withBackgroundGeolocation: ConfigPlugin<
  {
    //ext?:Map<string,string|boolean>
    /**
     * Android license Default ""
     */
    license?: string,
    /**
     * Huawei HMS license Default ""
     */
    hmsLicense?: string,
    /**
     * Polygon Geofencing License Default ""
     */
    polygonLicense?: string
  } | void
> = (config, _props) => {
  const props = _props || {};

  return withPlugins(config, [
    [androidPlugin, {
      license: props.license,
      hmsLicense: props.hmsLicense,
      polygonLicense: props.polygonLicense
    }],
    [iOSPlugin, {
      // no props for ios currently.
    }]
  ]);
};

export default withBackgroundGeolocation;
