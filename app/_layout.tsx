import { Stack } from "expo-router";
import AppProviders from "../src/App";
import { StatusBar } from "expo-status-bar";
import { MaterialProfilesProvider } from "@/src/store/contexts/MaterialProfilesContext";

export default function RootLayout() {
  return (
    <AppProviders>
      <MaterialProfilesProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="material-profiles/[id]"
            options={{
              presentation: "modal",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </MaterialProfilesProvider>
    </AppProviders>
  );
}
