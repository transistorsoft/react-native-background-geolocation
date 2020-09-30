/// <reference path="../types.d.ts" />
///
declare module "react-native-background-geolocation" {

  /**
  * __[Android only]__ Configuration for showing an android dialog prior to forwarding the user to a permission settings-screen.
  *
  */
  interface PermissionRationale {
    /**
    * The title of the dialog window.
    */
    title?: string;

    /**
    * The body text of the dialog.
    * Provide an explanation of why you need this permission, similar in purpose to iOS' __`NSLocationAlwaysAndWhenInUseUsageDescription`__.
    */
    message?: string;

    /**
    * The text to display on the *positive action* button.
    */
    positiveAction?: string;

    /**
    * The text to display on the *negative action* button (eg: *Cancel*)
    */
    negativeAction?: string;
  }
}
