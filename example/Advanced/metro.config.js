const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

// Absolute path to your local library
const rnBGGeo = path.resolve(
  __dirname,
  '../../' // <--
);

// Helper to escape path in RegExp for blockList
const esc = p => p.replace(/[/\\]/g, '[\\/\\\\]');

const config = {
  watchFolders: [rnBGGeo],
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],

    // Prefer the app's copies of these to avoid duplicates from the linked lib
    extraNodeModules: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },

    // Keep Metro from crawling the lib's nested RN (if any)
    blockList: [
      new RegExp(`${esc(rnBGGeo)}${esc('/node_modules/react-native/')}.+`),
    ],

    // Newer Metro supports this (helps with symlinks)
    unstable_enableSymlinks: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);

