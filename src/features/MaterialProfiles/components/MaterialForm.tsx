import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, useTheme, ActivityIndicator } from "react-native-paper";

interface MaterialFormTranslations {
  materialName: string;
  costPerGram: string;
  densityLabel: string;
  energyConsumptionLabel: string;
}

interface CommonTranslations {
  saving: string;
  saveChanges: string;
  addProfile: string;
}

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
  translations: MaterialFormTranslations;
  commonTranslations: CommonTranslations;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ formData, onInputChange, onSave, isEditing, isSaving, currency, translations, commonTranslations }) => {
  const theme = useTheme();

  const getTranslatedLabel = (key: keyof MaterialFormTranslations, replacements?: { [key: string]: string | number }) => {
    let label = translations[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  return (
    <View style={styles.form}>
      <TextInput label={translations.materialName} value={formData.name} onChangeText={(text) => onInputChange("name", text)} mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={getTranslatedLabel("costPerGram", { currency: currency })} value={formData.costPerGram} onChangeText={(text) => onInputChange("costPerGram", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={translations.densityLabel} value={formData.density} onChangeText={(text) => onInputChange("density", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label={translations.energyConsumptionLabel} value={formData.energyConsumption} onChangeText={(text) => onInputChange("energyConsumption", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <Button mode="contained" onPress={onSave} style={styles.button} disabled={isSaving} icon={isSaving ? () => <ActivityIndicator size={20} color={theme.colors.onPrimary} /> : undefined}>
        {isSaving ? commonTranslations.saving : isEditing ? commonTranslations.saveChanges : commonTranslations.addProfile}
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
