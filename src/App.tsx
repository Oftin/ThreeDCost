import React, { useContext } from "react";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { PaperLightTheme, PaperDarkTheme, NavigationLightTheme, NavigationDarkTheme } from "./styles/theme";
import { SettingsProvider, SettingsContext } from "./store/contexts/SettingsContext";
import { MaterialProfilesProvider } from "./store/contexts/MaterialProfilesContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <MaterialProfilesProvider>
        <ThemedAppContent>{children}</ThemedAppContent>
      </MaterialProfilesProvider>
    </SettingsProvider>
  );
};

const ThemedAppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  const systemColorScheme = useColorScheme();

  const actualColorScheme = settings.themeMode === "system" ? systemColorScheme : settings.themeMode;

  const paperTheme = actualColorScheme === "dark" ? PaperDarkTheme : PaperLightTheme;
  const navigationTheme = actualColorScheme === "dark" ? NavigationDarkTheme : NavigationLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
    </PaperProvider>
  );
};

export default AppProviders;
