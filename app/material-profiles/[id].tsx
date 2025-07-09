import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import AddEditMaterialScreen from "@/src/features/MaterialProfiles/screens/AddEditMaterialScreen";

export default function AddEditMaterialRoute() {
  const { id } = useLocalSearchParams();
  const isEditing = id && id !== "new";
  const title = isEditing ? "Edytuj Profil Materiału" : "Dodaj Profil Materiału";

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <AddEditMaterialScreen />
    </>
  );
}
