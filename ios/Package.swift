// swift-tools-version: 6.0
import PackageDescription

// React Native's Swift Package Manager app mode (`npx react-native spm`, React Native 0.88 or later).
// CocoaPods apps ignore this file and use RNBackgroundGeolocation.podspec. (WO-189)
//
// The two React Native paths below are not relative to this file. React Native's autolinker links
// <app>/ios/build/generated/autolinking/libs/RNBackgroundGeolocation to this ios/ directory, and SwiftPM
// resolves them from that link. The package and product name must equal package.json
// "swiftpmConfig.name". (WO-189)
let package = Package(
    name: "RNBackgroundGeolocation",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "RNBackgroundGeolocation", targets: ["RNBackgroundGeolocation"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        // The twin of RNBackgroundGeolocation.podspec's `tslm_version` default: change both together
        // (scripts/preflight.sh fails when their minimums differ). The podspec's TSLOCATIONMANAGER_VERSION
        // override has no SwiftPM equivalent. The BackgroundGeolocation product re-exports
        // TSBackgroundFetch, which this bridge does not import. (WO-189)
        .package(url: "https://github.com/transistorsoft/native-background-geolocation.git", .upToNextMinor(from: "4.9.0")),
    ],
    targets: [
        .target(
            name: "RNBackgroundGeolocation",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
                .product(name: "BackgroundGeolocation", package: "native-background-geolocation"),
            ],
            // ios/ itself, so the target reaches Resources/PrivacyInfo.xcprivacy beside the sources. (WO-189)
            path: ".",
            exclude: ["RNBackgroundGeolocation.xcodeproj", "RNBackgroundGeolocationTests"],
            sources: ["RNBackgroundGeolocation"],
            resources: [.process("Resources/PrivacyInfo.xcprivacy")],
            publicHeadersPath: "RNBackgroundGeolocation",
            // React Native's SwiftPM pipeline does not define this (only CocoaPods does); without it the
            // module builds without its TurboModule half. (WO-189)
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            // What the podspec and TSLocationManager.podspec link; the native package declares none. (WO-189)
            linkerSettings: [
                .linkedLibrary("z"),
                .linkedLibrary("sqlite3"),
                .linkedLibrary("c++"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
