// Type-surface assertions — compile-only, no runtime.  (WO-007)
//
// Verifies the per-permission requestPermission API against the published
// @transistorsoft/background-geolocation-types surface this package re-exports.
import BackgroundGeolocation, {
  Permission,
  AuthorizationStatus,
} from "react-native-background-geolocation";

async function requestPermissionSurface(): Promise<void> {
  // A-form: no argument — everything the configuration requires.
  const all: AuthorizationStatus = await BackgroundGeolocation.requestPermission();

  // B-form: location only.
  const location: AuthorizationStatus =
    await BackgroundGeolocation.requestPermission(Permission.Location);

  // C-form: motion only; DeniedAlways is the Android permanent-denial status.
  try {
    const motion: AuthorizationStatus =
      await BackgroundGeolocation.requestPermission(Permission.Motion);
    void motion;
  } catch (status) {
    if (status === AuthorizationStatus.DeniedAlways) {
      // Only the app-settings screen can restore the motion permission now.
    }
  }

  void all;
  void location;
}

void requestPermissionSurface;
