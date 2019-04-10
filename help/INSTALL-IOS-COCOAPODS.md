# iOS Installation with CocoaPods

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

### `Podfile`

If you **don't** already have an `ios/Podfile` initialized, run the following command:
```shell
$ cd ios
$ pod init
```

Replace the contents of `Podfile` with the following, substituting `_YOUR_PROJECT_TARGET`:
```ruby
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target '_YOUR_PROJECT_TARGET_' do
  rn_path = '../node_modules/react-native'

  # See http://facebook.github.io/react-native/docs/integration-with-existing-apps.html#configuring-cocoapods-dependencies
  pod 'yoga', path: "#{rn_path}/ReactCommon/yoga/yoga.podspec"
  pod 'React', path: rn_path, subspecs: [
    'Core',
    'CxxBridge',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTGeolocation',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
  ]

  # React Native third party dependencies podspecs
  pod 'DoubleConversion', :podspec => "#{rn_path}/third-party-podspecs/DoubleConversion.podspec"
  pod 'glog', :podspec => "#{rn_path}/third-party-podspecs/glog.podspec"
  # If you are using React Native <0.54, you will get the following error:
  # "The name of the given podspec `GLog` doesn't match the expected one `glog`"
  # Use the following line instead:
  #pod 'GLog', :podspec => "#{rn_path}/third-party-podspecs/GLog.podspec"
  pod 'Folly', :podspec => "#{rn_path}/third-party-podspecs/Folly.podspec"

end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == "React"
      target.remove_from_project
    end
  end
end

```

### `react-native link`

Running `react-native link` will automatically install the plugin into your `Podfile`.

- Follow the [`react-native link` instructions](./INSTALL-IOS-RNPM.md).
- Install the new CocoaPods:

```shell
$ cd ios
$ pod install
```
