declare module "react-native-background-geolocation" {
  /**
  * Configures the SDK for authorization wtih your server's [[accessToken]] token (eg: [JSON Web Token](https://jwt.io/)) and automatically requests new tokens when server returns HTTP status `"401 Unauthorized"`.
	*
	* __Note:__ Only *[JSON Web Token](https://jwt.io/)* (JWT) is currently supported.
	*
	* The SDK will automatically apply the configured [[accessToken]] to each HTTP request's `Authorization` header, eg:
  *
  * `"Authorization": "Bearer XXX.YYY.ZZZ"`
  *
  * When using [[Config.authorization]], you do **not** need to manually configure [[Config.headers]] with the `Authorization` parameter.  It is all **automatic**.
	*
	* If provided with [[refreshUrl]], [[refreshToken]] and [[refreshPayload]], the SDK can automatically re-register for a new token after expiration, such as when an HTTP response `401 Unauthorized` is received.
	*
  * ## Configuration
  *
	* @example
  * ```typescript
  * let myToken = this.getMyAuthorizationToken();
  *
  * BackgroundGeolocation.onAuthorization((event) => {
  *   if (event.success) {
  *     console.log("[authorization] ERROR: ", event.error);
  *   } else {
  *     console.log("[authorization] SUCCESS: ", event.response);
  *   }
  * });
  *
  * BackgroundGeolocation.ready({
  *   url: "https://app.your.server.com/users/locations",
  *   autoSync: true,
  *   authorization: {
  *     strategy: "JWT",
  *     accessToken: myToken.accessToken,
  *     refreshToken: myToken.refreshToken
  *     refreshUrl: "https://auth.your.server.com/tokens",
  *     refreshPayload: {
  *       the_refresh_token_field_name: "{refreshToken}"
  *     },
  *     expires: myToken.expiresAt
  *   }
  * });
  * ```
	*
  * ## Receiving the Response from [[refreshUrl]].
  *
  * Whenever a response is received from [[refreshUrl]], the SDK will fire the [[BackgroundGeolocation.onAuthorization]] event.  Your callback will be provided an [[AuthorizationEvent]].  Check [[AuthorizationEvent.success]]:
  * - When successful, [[AuthorizationEvent.response]] will contain the decoded JSON from [[refreshUrl]].
  * - When a failure occurs, [[AuthorizationEvent.error]] will contain an error message.
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onAuthorization((event) => {
  *   if (event.success) {
  *     console.log("[authorization] ERROR: ", event.error);
  *   } else {
  *     console.log("[authorization] SUCCESS: ", event.response);
  *   }
  * });
  * ```
	*/
  interface Authorization {
    /**
    * Authorization strategy.  Only [JWT](https://jwt.io/) is supported.
    */
    strategy:string;
    /**
  	* Authorization token (eg: [JWT](https://jwt.io/)) required for authorization by your server at [[Config.url]].
    *
    * The SDK will automatically apply the configured `accessToken` to each HTTP request's `Authorization` header, eg:
    *
    * `"Authorization": "Bearer XXX.YYY.ZZZ"`
    *
    * You do **not** need to manually configure [[Config.headers]] with the `Authorization` parameter.  It is all **automatic**.
  	*/
    accessToken:string;
    /**
    * The token to be POSTed to [[refreshUrl]], encoded into the [[refreshPayload]], when a new [[accessToken]] is required after [[expires]] or when HTTP `401 Unauthorized` is received.
    */
    refreshToken?:string;
    /**
    * The url to your authorization server that provides new [[accessToken]] when expired.
    *
    * When the SDK receives a response the server, it will decode the JSON and recursively iterate through the keys, performing regular expressions and other String-analysis *to "taste"* the data in search of the following 3 items:
    *
    * 1. "access token"
    * 2. "refresh token"
    * 3. "expiry time"
    *
    * The SDK is designed to operate with *any* response data-structure.  For example, one authorization server might return a complex response such as:
    *
    * ```json
    * {
    *   "token": {
    *     "access_token": "XXX.YYY.ZZZ",
    *     "expires_at": 3900
    *   },
    *   "refresh_token": "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb"
    * }
    * ```
    *
    * While another server might return a flat response, such as:
    *
    * ```json
    * {
    *  "accessToken": "XXX.YYY.ZZZ",
    *  "refreshToken": "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
    *  "expiry": 3900
    * }
    * ```
    *
    * When the response from the server is received, the event [[BackgroundGeolocation.onAuthorization]] will be fired, provided with the [[AuthorizationEvent]].
    */
    refreshUrl?:string;
    /**
    * Refresh payload will be encoded into the FORM POST to the [[refreshUrl]] when requesting a new [[accessToken]] after expiration.
    *
    * You *must* provide one field-template which will represent your "refresh token" using the value: __`{refreshToken}`__.  The SDK will
    * _automatically_ replace this simple template with the configured [[refreshToken]].
    *
    * @example
    *
    * ```typescript
    * BackgroundGeolocation.ready({
    *   authorization: {
    *     strategy: "JWT",
    *     accessToken: "XXX.YYY.ZZZ",
    *     refreshUrl: "https://auth.your.server.com/tokens",
    *     refreshToken: "smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb",
    *     refreshPayload: {
    *       my_refresh_token: "{refreshToken}",
    *       grant_type: "refresh_token",
    *       foo: "another arbitrary field"
    *     }
    *   }
    * });
    * ```
    *
    * with the configuration above, a **`curl`** representation of the SDK's FORM POST, might look like this:
    * ```bash
    * $ curl -X POST \
    *   -F 'my_refresh_token=smTsfaspfgaadsfgqZerUt0wueflasdfkaxjdfeKIacb' \
    *   -F 'grant_type=refresh_token' \
    *   -F 'foo=another arbitrary field' \
    *   https://auth.your.server.com/tokens
    * ```
    *
    */
    refreshPayload?:any;
    /**
    * Token expiry time in seconds.
    */
    expires?:number;
  }
}

