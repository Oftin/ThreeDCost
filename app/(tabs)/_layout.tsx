import { TabBarIcon } from "@/src/features/common/components/TabBarIcon";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="calculatorScreen"
        options={{
          title: "Kalkulator",
          tabBarIcon: ({ color }) => <TabBarIcon name="calculator" color={color} />,
        }}
      />
      <Tabs.Screen
        name="materialProfilesScreen"
        options={{
          title: "Materiały",
          tabBarIcon: ({ color }) => <TabBarIcon name="cube" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ustawienia",
          tabBarIcon: ({ color }) => <TabBarIcon name="settings-helper" color={color} />,
        }}
      />
    </Tabs>
  );
}
