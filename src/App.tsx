import React from "react";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { PaperLightTheme, PaperDarkTheme, NavigationLightTheme, NavigationDarkTheme } from "./styles/theme";
import { SettingsProvider } from "./store/contexts/SettingsContext";
import { MaterialProfilesProvider } from "./store/contexts/MaterialProfilesContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();

  const paperTheme = colorScheme === "dark" ? PaperDarkTheme : PaperLightTheme;
  const navigationTheme = colorScheme === "dark" ? NavigationDarkTheme : NavigationLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <SettingsProvider>
          <MaterialProfilesProvider>{children}</MaterialProfilesProvider>
        </SettingsProvider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default AppProviders;
