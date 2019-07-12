Privacy Policy
------------------------------------------------------------------

`react-native-background-geolocation` ("The Plugin") does not upload *any* information to third-party services.  The plugin's HTTP Service will upload recorded locations *only* to the host *you* configure with [Config.url](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#url) option.

The Plugin automatically destroys locally recorded locations in its SQLite database which have not yet been uploaded to your configured [url](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#url) after a period of [#maxDaysToPersist](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#maxdaystopersist).

If you *have* configured the plugin with an [url](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#url) to your server, the plugin automatically destroys each locally persisted location in its SQLite database when your server returns a success response (eg: `200`).

For more information, see the [HTTP Guide](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.httpevent.html).