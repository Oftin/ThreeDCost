import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, useTheme, ActivityIndicator } from "react-native-paper";

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
}

const MaterialForm: React.FC<MaterialFormProps> = ({ formData, onInputChange, onSave, isEditing, isSaving }) => {
  const theme = useTheme();

  return (
    <View style={styles.form}>
      <TextInput label="Nazwa materiału" value={formData.name} onChangeText={(text) => onInputChange("name", text)} mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label="Koszt za gram (zł)" value={formData.costPerGram} onChangeText={(text) => onInputChange("costPerGram", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label="Gęstość (g/cm³)" value={formData.density} onChangeText={(text) => onInputChange("density", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <TextInput label="Zużycie energii (kWh/g)" value={formData.energyConsumption} onChangeText={(text) => onInputChange("energyConsumption", text)} keyboardType="numeric" mode="outlined" style={styles.input} disabled={isSaving} />
      <Button mode="contained" onPress={onSave} style={styles.button} disabled={isSaving} icon={isSaving ? () => <ActivityIndicator size={20} color={theme.colors.onPrimary} /> : undefined}>
        {isSaving ? "Zapisuję..." : isEditing ? "Zapisz Zmiany" : "Dodaj Profil"}
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
