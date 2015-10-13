Pod::Spec.new do |s|
  s.name = "react-native-background-geolocation"
  s.version = "0.0.9"
  s.summary = "Background Geolocation for React Native"
  s.author = 'Chris Scott'
  s.homepage = "https://github.com/transistorsoft/react-native-background-geolocation"
  s.platform = :ios, '7.0'
  s.dependency 'React'
  s.libraries = 'sqlite3'
  s.source_files = [
    'RNBackgroundGeolocation/**/*.{h,m}',
  ]
  s.vendored_frameworks = 'RNBackgroundGeolocation/TSLocationManager.framework'
end
