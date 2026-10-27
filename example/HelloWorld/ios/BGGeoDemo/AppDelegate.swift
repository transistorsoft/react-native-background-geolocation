import UIKit
import TSBackgroundFetch

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // [REQUIRED] Transistorsoft.  Here, not in the SceneDelegate: BGTaskScheduler registration must
    // finish before launch does, and a scene connects after this returns.
    TSBackgroundFetch.sharedInstance().didFinishLaunching()

    return true
  }
}
