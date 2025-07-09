import { MD3LightTheme as DefaultPaperLightTheme, MD3DarkTheme as DefaultPaperDarkTheme } from "react-native-paper";
import { DefaultTheme as DefaultNavigationLightTheme, DarkTheme as DefaultNavigationDarkTheme } from "@react-navigation/native";
import { CommonColors } from "./colors";

// --- Light Theme ---
export const PaperLightTheme = {
  ...DefaultPaperLightTheme,
  colors: {
    ...DefaultPaperLightTheme.colors,
    primary: CommonColors.primaryLight,
    onPrimary: CommonColors.onPrimaryLight,
    background: "#F8F8F8",
    surface: "#FFFFFF",
    onBackground: "#212121",
    onSurface: "#212121",
    onSurfaceVariant: "#616161",
    outline: "#D3D3D3",
    error: CommonColors.error,
    success: CommonColors.successLight,
    onSuccess: CommonColors.onSuccessLight,
  },
};

export const NavigationLightTheme = {
  ...DefaultNavigationLightTheme,
  colors: {
    ...DefaultNavigationLightTheme.colors,
    primary: CommonColors.primaryLight,
    background: PaperLightTheme.colors.background,
    card: PaperLightTheme.colors.surface,
    text: PaperLightTheme.colors.onBackground,
    border: PaperLightTheme.colors.outline,
    notification: CommonColors.warning,
  },
};

// --- Dark Theme ---
export const PaperDarkTheme = {
  ...DefaultPaperDarkTheme,
  colors: {
    ...DefaultPaperDarkTheme.colors,
    primary: CommonColors.primaryDark,
    onPrimary: CommonColors.onPrimaryDark,
    background: "#121212",
    surface: "#1E1E1E",
    onBackground: "#E0E0E0",
    onSurface: "#E0E0E0",
    onSurfaceVariant: "#A0A0A0",
    outline: "#424242",
    error: CommonColors.error,
    success: CommonColors.successDark,
    onSuccess: CommonColors.onSuccessDark,
  },
};

export const NavigationDarkTheme = {
  ...DefaultNavigationDarkTheme,
  colors: {
    ...DefaultNavigationDarkTheme.colors,
    primary: CommonColors.primaryDark,
    background: PaperDarkTheme.colors.background,
    card: PaperDarkTheme.colors.surface,
    text: PaperDarkTheme.colors.onBackground,
    border: PaperDarkTheme.colors.outline,
    notification: CommonColors.warning,
  },
};
