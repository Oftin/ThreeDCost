import { MD3LightTheme, MD3DarkTheme, configureFonts, MD3Colors } from "react-native-paper";
import merge from "deepmerge";
import { Platform } from "react-native";
import { colors } from "./colors";
import { Theme as NavigationTheme } from "@react-navigation/native";

type PaperFonts = ReturnType<typeof configureFonts>;

const customFontFamily = Platform.select({
  web: "SpaceMono-Regular",
  default: "SpaceMono-Regular",
});

export const PaperLightTheme = merge(MD3LightTheme, {
  colors: {
    primary: colors.blue500,
    accent: colors.orange500,
    background: colors.white,
    surface: colors.white,
    text: colors.darkGray,
    onSurface: colors.darkGray,
    onBackground: colors.darkGray,
    ...colors,
  },
  fonts: configureFonts({
    config: {
      displayLarge: { fontFamily: customFontFamily },
      displayMedium: { fontFamily: customFontFamily },
      displaySmall: { fontFamily: customFontFamily },
      headlineLarge: { fontFamily: customFontFamily },
      headlineMedium: { fontFamily: customFontFamily },
      headlineSmall: { fontFamily: customFontFamily },
      titleLarge: { fontFamily: customFontFamily },
      titleMedium: { fontFamily: customFontFamily },
      titleSmall: { fontFamily: customFontFamily },
      bodyLarge: { fontFamily: customFontFamily },
      bodyMedium: { fontFamily: customFontFamily },
      bodySmall: { fontFamily: customFontFamily },
      labelLarge: { fontFamily: customFontFamily },
      labelMedium: { fontFamily: customFontFamily },
      labelSmall: { fontFamily: customFontFamily },
    },
    isV3: true,
  }),
});

export const PaperDarkTheme = merge(MD3DarkTheme, {
  colors: {
    primary: colors.blue300,
    accent: colors.orange300,
    background: colors.darkGray,
    extraBackground: colors.black,
    surface: colors.darkerGray,
    text: colors.white,
    onSurface: colors.white,
    onBackground: colors.white,
    ...colors,
  },
  fonts: configureFonts({
    config: {
      displayLarge: { fontFamily: customFontFamily },
      displayMedium: { fontFamily: customFontFamily },
      displaySmall: { fontFamily: customFontFamily },
      headlineLarge: { fontFamily: customFontFamily },
      headlineMedium: { fontFamily: customFontFamily },
      headlineSmall: { fontFamily: customFontFamily },
      titleLarge: { fontFamily: customFontFamily },
      titleMedium: { fontFamily: customFontFamily },
      titleSmall: { fontFamily: customFontFamily },
      bodyLarge: { fontFamily: customFontFamily },
      bodyMedium: { fontFamily: customFontFamily },
      bodySmall: { fontFamily: customFontFamily },
      labelLarge: { fontFamily: customFontFamily },
      labelMedium: { fontFamily: customFontFamily },
      labelSmall: { fontFamily: customFontFamily },
    },
    isV3: true,
  }),
});

export const NavigationLightTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: colors.blue500,
    background: colors.white,
    card: colors.white,
    text: colors.darkGray,
    border: colors.lightGray,
    notification: colors.orange500,
  },
  fonts: {
    regular: { fontFamily: customFontFamily, fontWeight: "normal" },
    medium: { fontFamily: customFontFamily, fontWeight: "500" },
    bold: {
      fontFamily: "",
      fontWeight: "normal",
    },
    heavy: {
      fontFamily: "",
      fontWeight: "normal",
    },
  },
};

export const NavigationDarkTheme: NavigationTheme = {
  dark: true,
  colors: {
    primary: colors.blue300,
    background: colors.darkGray,
    card: colors.darkerGray,
    text: colors.white,
    border: colors.mediumGray,
    notification: colors.orange300,
  },
  fonts: {
    regular: { fontFamily: customFontFamily, fontWeight: "normal" },
    medium: { fontFamily: customFontFamily, fontWeight: "500" },
    bold: {
      fontFamily: "",
      fontWeight: "normal",
    },
    heavy: {
      fontFamily: "",
      fontWeight: "normal",
    },
  },
};
