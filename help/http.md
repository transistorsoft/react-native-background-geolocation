# HTTP Features

## JSON Request Templates

The plugin supports customizable JSON request schemas with the following config options:

| Option             | Type       | Default     | Description |
|--------------------|------------|-------------|-------------|
|`httpRootProperty`  | `String`   | `location`  | The root key in the JSON to render records |
|`locationTemplate`  | `String`   | `undefined` | Optional template to render `location` data |
|`geofenceTemplate`  | `String`   | `undefined` | Optional template to render `geofence` data |

### `httpRootProperty`

Traditionally, the plugin had a hard-coded "Location Data Schema", where it automatically appended location-data to the `location` key in the JSON data, eg:

```javascript
bgGeo.configure({
  url: 'http://my_url',
  params: {
    myParams: {foo: 'bar'}
  }
});
```

```javascript
POST /my_url
{
  "location": {  // <-- hardcoded "httpRootProperty"
    "coords": {
        "latitude": 23.23232323,
        "longitude": 37.37373737
    }
  },
  "myParams": {
    "foo": "bar"
  }
}
```

With `httpRootProperty`, you can now customize this key:

```javascript
bgGeo.configure({
  url: 'http://my_url',
  httpRootProperty: 'data',
  params: {
    myParams: {foo: 'bar'}
  }
});
```

```javascript
POST /my_url
{
  "data": {  // <-- customizable "httpRootProperty"!
    "coords": {
        "latitude": 23.23232323,
        "longitude": 37.37373737
    }
  },
  "myParams": {
    "foo": "bar"
  }
}
```

#### `httpRootProperty: "."`

If you'd rather POST your data *as* the root of the JSON, use **`httpRootProperty: "."`**:

```javascript
bgGeo.configure({
  url: 'http://my_url',
  httpRootProperty: '.',
  params: {
    myParams: {foo: 'bar'}
  }
})
```

```javascript
POST /my_url
{
  "coords": {  // <-- location data place *as* the root of the JSON
      "latitude": 23.23232323,
      "longitude": 37.37373737
  },
  "myParams": {
    "foo": "bar"
  }
}
```

### `locationTemplate` & `geofenceTemplate`

If you wish to provide your own custom HTTP JSON schema, you can configure distinct templates for both `location` and `geofence` data.  Evaluate variables in your template using Ruby `erb`-style tags:

```erb
<%= variable_name %>
```

Example:

```javascript
bgGeo.configure({
  url: 'http://my_url',
  httpRootProperty: 'data',
  params: {
    myParams: {foo: 'bar'}
  },
  locationTemplate: '{ "lat":<%= latitude %>, "lng":<%= longitude %> }',
  extras: {
    "location_extra_foo": "extra location data"
  }
})
```

```javascript
POST /my_url
{
  "data": {
    "lat": 45.5192657,
    "lng": -73.6169116,
    "location_extra_foo": "extra location data"
  },
  "myParams": {
    "foo": "bar"
  }
}
```

### Template Tags

#### Common Tags

The following template tags are common to both **`locationTemplate`** and **`geofenceTemplate`**:

| Tag | Type | Description |
|-----|------|-------------|
| `latitude` | `Float` ||
| `longitude` | `Float` ||
| `speed` | `Float` | Meters|
| `heading` | `Float` | Degress|
| `accuracy` | `Float` | Meters|
| `altitude` | `Float` | Meters|
| `altitude_accuracy` | `Float` | Meters|
| `timestamp` | `String` |ISO-8601|
| `uuid` | `String` |Unique ID|
| `event` | `String` |`motionchange|geofence|heartbeat`
| `odometer` | `Float` | Meters|
| `activity.type` | `String` | `still|on_foot|running|on_bicycle|in_vehicle|unknown`|
| `activity.confidence` | `Integer` | 0-100%|
| `battery.level` | `Float` | 0-100%|
| `battery.is_charging` | `Boolean` | Is device plugged in?|

#### Geofence Tags

The following template tags are specific to **`geofenceTemplate`** only:

| Tag | Type | Description |
|-----|------|-------------|
| `geofence.identifier` | `String` | Which geofence?|
| `geofence.action` | `String` | `ENTER|EXIT`|

#### Quoting String Values

You're completely responsible for `"quoting"` your own `String` values.  The following will generate a JSON parsing error:

```javascript
bgGeo.configure({
  locationTemplate: '{ "event":<%= event %> }',
});
```

In the logs, you'll find:
```
‼️-[TSLocation templateError:template:] locationTemplate error: Invalid value around character 10.
{ "event":<%= event %> }
```

To fix this, the `String` tag `<%= event %>` must be wrapped in `""`:

```javascript
bgGeo.configure({
  locationTemplate: '{ "event":"<%= event %>" }',
});
```

#### Boolean, Float and Integer Values

`Boolean`, `Float` and `Integer` values do **not** require quoting:

```
bgGeo.configure({
  locationTemplate: '{ "is_moving":<%= is_moving %>, "odometer":<%= odometer %> }',
});
```

#### Array Templates

You're not forced to define your templates as an **`{Object}`** &mdash; You can define them as an **`[Array]`** too.

```javascript
bgGeo.configure({
  url: 'http://my_url',
  httpRootProperty: 'data',
  params: {
    myParams: {foo: 'bar'}
  },
  locationTemplate: '[ <%= latitude %>, <%= longitude %> ]',
  extras: {
    "location_extra_foo": "extra location data"
  }
})
```

```javascript
POST /my_url
{
  "data": [
    45.5192657,
    -73.6169116,
    {"location_extra_foo": "extra location data"}  // <-- appended #extras
  ],
  "myParams": {
    "foo": "bar"
  }
}
```

:exclamation: `#extras` are automatically appened to the last element of the array as an `{Object}`.

#### Array Template with `httpRootProperty: "."`

:warning: This case is tricky and should probably be avoided, particularly if you have configured `#params`, since there no place in the request JSON to append them.

```javascript
bgGeo.configure({
  url: 'http://my_url',
  httpRootProperty: '.',
  params: {
    myParams: {foo: 'bar'}
  },
  locationTemplate: '[<%=latitude%>, <%=longitude%>]',
  extras: {
    "location_extra_foo": "extra location data"
  }
})
```

```javascript
- POST /my_url
 [  // <-- #params are lost.  There's no place in the data-structure to append them.
  45.5192657,
  -73.6169116,
  {
    "location_extra_foo": "extra location data"
  }
]
```


