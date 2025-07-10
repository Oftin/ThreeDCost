import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useMaterialForm } from "../hooks/useMaterialForm";
import MaterialForm from "../components/MaterialForm";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

const AddEditMaterialScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const T = useTranslation();
  const { settings } = React.useContext(SettingsContext);

  const { formData, handleInputChange, handleSave, isEditing, isSaving } = useMaterialForm({
    profileId: id,
    onSaveSuccess: () => {
      router.back();
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        {Platform.OS === "ios" ? (
          <Appbar.Content title={isEditing ? T.materialProfiles.editProfile : T.materialProfiles.addProfile} />
        ) : (
          <>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title={isEditing ? T.materialProfiles.editProfile : T.materialProfiles.addProfile} />
          </>
        )}

        {Platform.OS === "ios" && <Appbar.Action icon="close" onPress={() => router.back()} />}
      </Appbar.Header>

      <MaterialForm formData={formData} onInputChange={handleInputChange} onSave={handleSave} isEditing={isEditing} isSaving={isSaving} currency={settings.currency} translations={T.materialProfiles} commonTranslations={T.common} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddEditMaterialScreen;
