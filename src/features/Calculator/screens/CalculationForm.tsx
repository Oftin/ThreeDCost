import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text, useTheme, SegmentedButtons } from "react-native-paper";
import { FormDataType } from "../types/calculatorTypes";
import { MaterialProfile } from "../../MaterialProfiles/types/materialTypes";
import { useTranslation } from "@/src/localization/i18n";

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
  const T = useTranslation();

  const materialOptions = materials.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const getTranslatedLabel = (key: keyof typeof T.calculator, replacements?: { [key: string]: string | number }) => {
    let label = T.calculator[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  return (
    <View style={styles.formContainer}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {T.calculator.printParameters}
      </Text>
      <TextInput label={getTranslatedLabel("materialCost", { currency: currency })} value={formData.materialCost} onChangeText={(text) => onInputChange("materialCost", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.printWeight} value={formData.printWeight} onChangeText={(text) => onInputChange("printWeight", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <View style={styles.materialSelectContainer}>
        <Text style={styles.materialSelectLabel}>{T.calculator.selectMaterialProfile}</Text>
        <SegmentedButtons value={selectedMaterialId || ""} onValueChange={onMaterialSelect} buttons={materialOptions} />
      </View>
      <TextInput label={T.calculator.printTimeHours} value={formData.printTimeHours} onChangeText={(text) => onInputChange("printTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.printTimeMinutes} value={formData.printTimeMinutes} onChangeText={(text) => onInputChange("printTimeMinutes", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("machineDepreciationRate", { currency: currency })} value={formData.machineDepreciationRate} onChangeText={(text) => onInputChange("machineDepreciationRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("energyCostPerHour", { currency: currency })} value={formData.energyCostPerHour} onChangeText={(text) => onInputChange("energyCostPerHour", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.postProcessingTimeHours} value={formData.postProcessingTimeHours} onChangeText={(text) => onInputChange("postProcessingTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("additionalCosts", { currency: currency })} value={formData.additionalCosts} onChangeText={(text) => onInputChange("additionalCosts", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {T.calculator.designParameters}
      </Text>
      <TextInput label={T.calculator.designTimeHours} value={formData.designTimeHours} onChangeText={(text) => onInputChange("designTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("designerHourlyRate", { currency: currency })} value={formData.designerHourlyRate} onChangeText={(text) => onInputChange("designerHourlyRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.desiredMarginPercentage} value={formData.desiredMarginPercentage} onChangeText={(text) => onInputChange("desiredMarginPercentage", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: 10,
  },
  sectionTitle: {
    marginVertical: 15,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
  },
  materialSelectContainer: {
    marginVertical: 15,
  },
  materialSelectLabel: {
    marginBottom: 8,
  },
});

export default CalculationForm;
