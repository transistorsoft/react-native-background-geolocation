require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
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
  s.source              = { :git => 'https://github.com/transistorsoft/react-native-background-geolocation.git', :tag => s.version }
  s.platform            = :ios, '8.0'

  s.dependency 'React'
  s.preserve_paths      = 'docs', 'CHANGELOG.md', 'LICENSE', 'package.json', 'RNBackgroundGeolocation.ios.js'
  s.dependency 'CocoaLumberjack', '~> 3.0'
  s.source_files        = 'ios/RNBackgroundGeolocation/*.{h,m}'
  s.libraries           = 'sqlite3'
  s.vendored_frameworks = 'ios/RNBackgroundGeolocation/TSLocationManager.framework'  
end
