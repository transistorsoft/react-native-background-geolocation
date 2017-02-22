# Infinite Geofencing

The Background Geolocation contains powerful geofencing features that allow you to monitor any number of circular geofences you wish (thousands even), in spite of limits imposed by the native platform APIs (**20 for iOS; 100 for Android**).

The plugin achieves this by storing your geofences in its database, using a [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to determine those geofences in proximity (@see config [geofenceProximityRadius](./README.md/#param-integer-geofenceproximityradius-meters)), activating only those geofences closest to the device's current location (according to limit imposed by the corresponding platform).

![](https://dl.dropboxusercontent.com/u/2319755/background-geolocation/images/geofenceProximityRadius_iphone6_spacegrey_portrait.png)

When the device is determined to be moving, the plugin periodically queries for geofences in proximity (eg. every minute) using the latest recorded location.  This geospatial query is **very fast**, even with tens-of-thousands geofences in the database.

## Event: `geofenceschange`

When a proximity-query detects a change in the list of monitored geofences, it will fire the `geofenceschanged` event, providing information about which geofences were activiated as well as those which were de-activiated.

The parameter provided to your event-handler takes the following form:
####@param {Array} on The list of geofences just activated.
####@param {Array off The list of geofences just de-activated

```Javascript
bgGeo.on('geofenceschange', function(event) {
  var on = event.on;   //<-- new geofences activiated.
  var off = event.off; //<-- geofences that were de-activated.

  // Create map circles
  for (var n=0,len=on.length;n<len;n++) {
    var geofence = on[n];
    createGeofenceMarker(geofence)
  }

  // Remove map circles
  for (var n=0,len=off.length;n<len;n++) {
    var identifier = off[n];
    removeGeofenceMarker(identifier);
  }
});
```

This `event` object provides only the *changed* geofences, those which just activated or de-activated.

When **all** geofences have been removed, the event object will provide an empty-array `[]` for both `#on` and `#off` keys, ie:
```Javascript
{
    on: [{}, {}, ...],  // <-- Entire geofence objects {}
    off: ['identifier_foo', 'identifier_bar']  <-- just the identifiers
}
```

```Javascript
bgGeo.on('geofenceschange', function(event) {
  console.log("geofenceschange fired! ", event);
});

// calling remove geofences will cause the `geofenceschange` event to fire
bgGeo.removeGeofences();

=> geofenceschange fired! {on: [], off: []}

```

## Config: [`geofenceProximityRadius`](./README.md/#param-integer-geofenceproximityradius-meters)

[`@config geofenceProximityRadius {Integer} [1000] meters`](./README.md/#param-integer-geofenceproximityradius-meters) controls the circular area around the device's current position where geofences will be activated.  As the device moves, the plugin periodically queries for geofences in proximity of the last-recorded location (default once-per-minute).

You can change the [`geofenceProximityRadius`](./README.md/#param-integer-geofenceproximityradius-meters) at run-time; the `geofenceschange` event will immediately fire if the monitored list-of-geofences changed as a result:

```Javascript
bgGeo.on('geofenceschange', function(event) { 
    console.log('geofenceschange fired! ', event);
});

bgGeo.setConfig({geofenceProximityRadius: 1000});
=> geofenceschange fired! {on: [{}, {}, ...], off: []}

bgGeo.setConfig({geofenceProximityRadius: 0});
=> geofenceschange fired! {on: [], off: ['foo', 'bar', ...]}

bgGeo.setConfig({geofenceProximityRadius: 0});
=> geofenceschange fired! {}
```

## Adding large lists of geofences

The plugin is perfectly capable of monitoring **large** lists of geofences (tested with tens-of-thousands).  However, when adding geofences, it's over **10* faster** to use the method `addGeofences`(plural) rather than looping and executing `#addGeofence`

```Javascript
var geofences = [...];  // <-- list of thousands-of-geofences

// 1. slow
for (var n=0,len-geofences.length;n<len;n++) {
    bgGeo.addGeofence(geofences[n]);
}

// 2. Super fast.
bgGeo.addGeofences(geofences);
```

## Initializing your Map with Geofences

If you render `Circle` markers on your map, you don't need to query your geofences with [`#getGeofences`](./README.md/#getgeofencescallbackfn-failurefn).  This is particularly import when monitoring large lists of geofences.

Simply listen to the `geofenceschange` event and render Map markers accordingly.

