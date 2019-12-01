declare module "react-native-background-geolocation" {
	/**
	* The event-object provided to [[BackgroundGeolocation.onAuthorization]]
	*
	* @example
	* ```typescript
	* BackgroundGeolocation.onAuthorization(authorizationEvent => {
	*   if (authorizationEvent.success) {
	*			console.log("[authorization] SUCCESS: ", authorizationEvent.response);
	*		else {
	*			console.log("[authorization] FAILURE: ", authorizationEvent.error);
	*		}
	* });
	* ```
	*/
	interface AuthorizationEvent {
		/**
		* `true` when an authorization request to [[Authorization.refreshUrl]] was successful.
		*/
	  success: boolean;
	  /**
	  * When [[success]] is `false`, this is the error message from [[Authorization.refreshUrl]].  Otherwise, `null`.
	  */
	  error: string;
	  /**
	  * when [[success]] is `true`, this is the decoded JSON response returned from [[Authorization.refreshUrl]].  Otherwise, `null`.
	  */
	  response:any;
	}
}
