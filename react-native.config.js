module.exports = {
  // config for a library is scoped under "dependency" key
  dependency: {
    platforms: {
      ios: {
        "sharedLibraries": [
          "libsqlite3",
          "libz"
        ]
      },
      android: {}, // projects are grouped into "platforms"
    },
    assets: [], // stays the same
    // hooks are considered anti-pattern, please avoid them
    hooks: {
      "postlink": "node node_modules/react-native-background-geolocation/scripts/postlink.js",
      "postunlink": "node node_modules/react-native-background-geolocation/scripts/postunlink.js"
    },
  },
};
