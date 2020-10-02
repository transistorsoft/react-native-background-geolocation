declare module "react-native-background-geolocation" {
  /**
  * Response object returned by [[BackgroundGeolocation.findOrCreateTransistorAuthorizationToken]] for configuring the SDK's [[Authorization]] with Transistor Software's Demo Server at [http://tracker.transistorsoft.com](http://tracker.transistorsoft.com).
  *
  * You may also run your own instance of Demo Server locally.  See [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console)
  *
  * The test server is a great way to debug location problems or evalute the SDK's behaviour, since the results can easily be shared with *Transistor Software* when requesting support.
  *
  * ![](https://dl.dropboxusercontent.com/s/3abuyyhioyypk8c/screenshot-tracker-transistorsoft.png?dl=1)
  *
  *
  * @example
  * ```typescript
  * // Url to demo server.
  * let url = "http://tracker.transistorsoft.com";
  * let orgname = "my-company-name";
  * let username = "my-username";
  *
  * // Fetch an authoriztion token from server.  The SDK will cache the received token.
  * let token = await
  *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(orgname, username, url);
  *
  * BackgroundGeolocation.ready({
  *   transistorAuthorizationToken: token
  * })
  * ```
  *
  * ## Viewing Your Tracking Results
  *
  * To *view* your tracking results in the browser, use your configured "Organization Name" and visit:
  *
  * http://tracker.transistorsoft.com/my-organization-name
  *
  */
  interface TransistorAuthorizationToken {
  	/**
  	* The authorization token to provide to [[Authorization.accessToken]]
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *  authorization: {
    *    accessToken:
    *  }
    * });
    * ```
  	*/
  	accessToken:string;
  	/**
  	* The token used to request to provide to [[Authorization.refreshToken]]
  	*/
  	refreshToken:string;
  	/**
  	* The expiry time of the [[Authorization.accessToken]]
  	*/
  	expires:number;
    /**
    * The url to the Transistor Demo server where this token came from.
    * __Read only__
    */
    url?: string;
  }
}
