import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text, useTheme, SegmentedButtons } from "react-native-paper";
import { FormDataType } from "../types/calculatorTypes";
import { MaterialProfile } from "../../MaterialProfiles/types/materialTypes";

interface CalculationFormProps {
  formData: FormDataType;
  onInputChange: (field: keyof FormDataType, value: string) => void;
  materials: MaterialProfile[];
  selectedMaterialId?: string;
  onMaterialSelect: (id: string) => void;
  currency: string;
}

const CalculationForm: React.FC<CalculationFormProps> = ({ formData, onInputChange, materials, selectedMaterialId, onMaterialSelect, currency }) => {
  const theme = useTheme();

  const materialOptions = materials.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <View style={styles.formContainer}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Parametry Druku 3D
      </Text>
      <TextInput label={`Koszt materiału (gramy, ${currency})`} value={formData.materialCost} onChangeText={(text) => onInputChange("materialCost", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Waga wydruku (gramy)" value={formData.printWeight} onChangeText={(text) => onInputChange("printWeight", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <View style={styles.materialSelectContainer}>
        <Text style={styles.materialSelectLabel}>Wybierz profil materiału:</Text>
        <SegmentedButtons value={selectedMaterialId || ""} onValueChange={onMaterialSelect} buttons={materialOptions} />
      </View>

      <TextInput label="Czas druku (godziny)" value={formData.printTimeHours} onChangeText={(text) => onInputChange("printTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Czas druku (minuty)" value={formData.printTimeMinutes} onChangeText={(text) => onInputChange("printTimeMinutes", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Amortyzacja maszyny (koszt za godzinę, zł)" value={formData.machineDepreciationRate} onChangeText={(text) => onInputChange("machineDepreciationRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Koszt energii elektrycznej (za godzinę, zł)" value={formData.energyCostPerHour} onChangeText={(text) => onInputChange("energyCostPerHour", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Czas post-processing (godziny)" value={formData.postProcessingTimeHours} onChangeText={(text) => onInputChange("postProcessingTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Dodatkowe koszty (np. opakowanie, wysyłka, zł)" value={formData.additionalCosts} onChangeText={(text) => onInputChange("additionalCosts", text)} keyboardType="numeric" mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Parametry Projektowania 3D
      </Text>
      <TextInput label="Czas projektowania (godziny)" value={formData.designTimeHours} onChangeText={(text) => onInputChange("designTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Stawka godzinowa projektanta (zł)" value={formData.designerHourlyRate} onChangeText={(text) => onInputChange("designerHourlyRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label="Żądana marża (%)" value={formData.desiredMarginPercentage} onChangeText={(text) => onInputChange("desiredMarginPercentage", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: 10,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
  },
  materialSelectContainer: {
    marginBottom: 15,
  },
  materialSelectLabel: {
    marginBottom: 8,
  },
});

export default CalculationForm;
