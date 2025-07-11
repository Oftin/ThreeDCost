import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "@/src/localization/i18n";

interface MaterialFormProps {
  formData: {
    name: string;
    costPerGram: string;
    density: string;
    energyConsumption: string;
  };
  onInputChange: (field: keyof MaterialFormProps["formData"], value: string) => void;
  onSave: () => void;
  isEditing: boolean;
  isSaving: boolean;
  currency: string;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ formData, onInputChange, onSave, isEditing, isSaving, currency }) => {
  const theme = useTheme();
  const T = useTranslation();

  const getTranslatedLabel = (key: keyof typeof T.materialProfiles | keyof typeof T.common, replacements?: { [key: string]: string | number }) => {
    let label;

    if (T.materialProfiles && (key as keyof typeof T.materialProfiles) in T.materialProfiles) {
      label = T.materialProfiles[key as keyof typeof T.materialProfiles];
    } else if (T.common && (key as keyof typeof T.common) in T.common) {
      label = T.common[key as keyof typeof T.common];
    } else {
      label = String(key);
    }

    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  return (
    <View style={styles.form}>
      <TextInput label={getTranslatedLabel("materialName")} value={formData.name} onChangeText={(text) => onInputChange("name", text)} mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={getTranslatedLabel("costPerGram", { currency: currency })} value={formData.costPerGram} onChangeText={(text) => onInputChange("costPerGram", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={getTranslatedLabel("densityLabel")} value={formData.density} onChangeText={(text) => onInputChange("density", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={getTranslatedLabel("energyConsumptionLabel")} value={formData.energyConsumption} onChangeText={(text) => onInputChange("energyConsumption", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <Button mode="contained" onPress={onSave} style={styles.button} disabled={isSaving} icon={isSaving ? () => <ActivityIndicator size={20} color={theme.colors.onPrimary} /> : undefined}>
        {isSaving ? T.common.saving : isEditing ? T.common.saveChanges : T.common.addProfile}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});

export default MaterialForm;
