require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.cocoapods_version   = '>= 1.10.0'
  s.name                = 'RNBackgroundGeolocation'
  s.version             = package['version']
  s.summary             = package['description']
  s.description         = <<-DESC
    Cross-platform background geolocation module for React Native with
    battery-saving circular stationary-region monitoring and stop detection.
  DESC
  s.homepage            = package['homepage']
  s.license             = package['license']
  s.author              = package['author']
  s.source              = {
    :git => 'https://github.com/transistorsoft/react-native-background-geolocation.git',
    :tag => s.version
  }

  s.platform            = :ios, '12.0'
  s.requires_arc        = true
  s.static_framework    = true

  s.source_files        = 'ios/RNBackgroundGeolocation/*.{h,m,mm}'
  s.preserve_paths      = 'docs', 'CHANGELOG.md', 'LICENSE', 'package.json', 'RNBackgroundGeolocation.ios.js'

  s.dependency 'CocoaLumberjack', '~> 3.8.5'
  s.dependency 'TSLocationManager', '~> 4.0.0'

  s.libraries           = 'sqlite3', 'z', 'stdc++'
  s.resource_bundles    = {
    'TSLocationManagerPrivacy' => ['ios/Resources/PrivacyInfo.xcprivacy']
  }

  # React Native dependencies:
  # - For RN >= 0.71, use the helper which wires up React-Core, ReactCodegen, etc.
  # - For older RN, fall back to React-Core manually.
  if defined?(install_modules_dependencies)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end
end
