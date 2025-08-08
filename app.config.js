export default {
  expo: {
    name: "ThreeDCost",
    slug: "threedcost-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "threedcost",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      buildNumber: "1.0.0",
      icon: {
        light: "./assets/images/ios-dark.png",
        dark: "./assets/images/ios-light.png",
        tinted: "./assets/images/ios-tinted.png",
      },
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"],
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: "com.kamil-bobrowski.threedcost",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      versionCode: 1,
      permissions: ["RECEIVE_BOOT_COMPLETED"],
      package: "com.kamilbobrowski.threedcost",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-9423845763354388~8404087632",
          iosAppId: "ca-app-pub-9423845763354388~2019794068",
        },
      ],
      [
        "expo-splash-screen",
        {
          // backgroundColor: "#232323",
          backgroundColor: "#FFFFFF",
          image: "./assets/images/splash-icon.png",
          dark: {
            image: "./assets/images/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "a43aca71-a8a0-4f3c-beb6-1e9a269bef2d",
      },
    },
  },
};
