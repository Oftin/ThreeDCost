import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useMaterialForm } from "../hooks/useMaterialForm";
import MaterialForm from "../components/MaterialForm";

const AddEditMaterialScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const { formData, handleInputChange, handleSave, isEditing, isSaving } = useMaterialForm({
    profileId: id,
    onSaveSuccess: () => {
      router.back();
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: isEditing ? "Edytuj Profil Materiału" : "Dodaj Profil Materiału" }} />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditing ? "Edytuj Profil" : "Dodaj Profil"} />
      </Appbar.Header>
      <MaterialForm formData={formData} onInputChange={handleInputChange} onSave={handleSave} isEditing={isEditing} isSaving={isSaving} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddEditMaterialScreen;
