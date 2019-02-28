declare module "react-native-background-geolocation" {
	/**
	* __`[iOS only]`__ Controls the text-elements of the plugin's location-authorization dialog.
  *
  * When you configure the plugin [[locationAuthorizationRequest]] __`Always`__ or __`WhenInUse`__ and the user *changes* the mode in the app's location-services settings or disabled location-services, the plugin will display an Alert dialog directing the user to the **Settings** screen.  **`locationAuthorizationAlert`** allows you to configure all the Strings for that Alert popup and accepts an `{}` containing the following keys:
	*
	* ![](https://dl.dropboxusercontent.com/s/wyoaf16buwsw7ed/docs-locationAuthorizationAlert.jpg?dl=1)
	*/
  interface LocationAuthorizationAlert {
  	/**
  	* The title of the alert if user changes, for example, the location-request to `WhenInUse` when you requested `Always`.
  	*
  	* Defaults to `Location services are off`.
		*/
    titleWhenOff: string;
    /**
    * The title of the alert when user disables location-services or changes the authorization request to `Never`.
    *
    * Defaults to `Background location is not enabled`.
    */
    titleWhenNotEnabled: string;
    /**
    * The body text of the alert.
    *
    * Defaults to: `To use background location, you must enable {locationAuthorizationRequest} in the Location Services settings`.
    */
    instructions: string;
    /**
    * Cancel button label.
    *
    * Defaults to `Cancel`.
    */
    cancelButton: string;
    /**
    * Settings button label.
    *
    * Defaults to `Settings`.
    */
    settingsButton: string;
  }
}
