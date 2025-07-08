import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { type ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface TabBarIconProps {
  name: IconName;
  color: string;
}

export function TabBarIcon(props: TabBarIconProps) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}
