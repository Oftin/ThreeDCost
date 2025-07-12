import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TextInput, Text, useTheme, SegmentedButtons, Dialog, Portal, RadioButton, Button } from "react-native-paper";
import { FormDataType } from "../types/calculatorTypes";
import { MaterialProfile } from "../../MaterialProfiles/types/materialTypes";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

type CalculationMode = "printOnly" | "printAndDesign";

interface CalculationFormProps {
  formData: FormDataType;
  onInputChange: (field: keyof FormDataType, value: string) => void;
  materials: MaterialProfile[];
  selectedMaterialId?: string;
  onMaterialSelect: (id: string) => void;
  currency: string;
  calculationMode: CalculationMode;
}

const CalculationForm: React.FC<CalculationFormProps> = ({ formData, onInputChange, materials, selectedMaterialId, onMaterialSelect, currency, calculationMode }) => {
  const theme = useTheme();
  const T = useTranslation();
  const { settings } = useContext(SettingsContext);

  const [materialDialogVisible, setMaterialDialogVisible] = useState(false);

  const showMaterialDialog = () => setMaterialDialogVisible(true);
  const hideMaterialDialog = () => setMaterialDialogVisible(false);

  const handleMaterialSelection = (id: string) => {
    onMaterialSelect(id);
    hideMaterialDialog();
  };

  const materialOptions = materials.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const selectedMaterialName = materials.find((m) => m.id === selectedMaterialId)?.name || "";

  const getTranslatedLabel = (key: keyof typeof T.calculator, replacements?: { [key: string]: string | number }) => {
    let label = T.calculator[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  const printWeightLabel = settings.unitSystem === "metric" ? T.calculator.printWeightMetric : T.calculator.printWeightImperial;

  return (
    <View style={styles.formContainer}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {T.calculator.printParameters}
      </Text>
      <TextInput label={getTranslatedLabel("materialCost", { currency: currency })} value={formData.materialCost} onChangeText={(text) => onInputChange("materialCost", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={printWeightLabel} value={formData.printWeight} onChangeText={(text) => onInputChange("printWeight", text)} keyboardType="numeric" mode="outlined" style={styles.input} />

      <TouchableOpacity onPress={showMaterialDialog} style={styles.touchableInput}>
        <TextInput label={T.calculator.selectMaterialProfile} value={selectedMaterialName} mode="outlined" editable={false} right={<TextInput.Icon icon="menu-down" />} style={[styles.input, { backgroundColor: theme.colors.surface }]} textColor={theme.colors.onSurface} pointerEvents="none" />
      </TouchableOpacity>

      <TextInput label={T.calculator.printTimeHours} value={formData.printTimeHours} onChangeText={(text) => onInputChange("printTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.printTimeMinutes} value={formData.printTimeMinutes} onChangeText={(text) => onInputChange("printTimeMinutes", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("machineDepreciationRate", { currency: currency })} value={formData.machineDepreciationRate} onChangeText={(text) => onInputChange("machineDepreciationRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("energyCostPerHour", { currency: currency })} value={formData.energyCostPerHour} onChangeText={(text) => onInputChange("energyCostPerHour", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={T.calculator.postProcessingTimeHours} value={formData.postProcessingTimeHours} onChangeText={(text) => onInputChange("postProcessingTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
      <TextInput label={getTranslatedLabel("additionalCosts", { currency: currency })} value={formData.additionalCosts} onChangeText={(text) => onInputChange("additionalCosts", text)} keyboardType="numeric" mode="outlined" style={styles.input} />

      {calculationMode === "printAndDesign" && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {T.calculator.designParameters}
          </Text>
          <TextInput label={T.calculator.designTimeHours} value={formData.designTimeHours} onChangeText={(text) => onInputChange("designTimeHours", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
          <TextInput label={getTranslatedLabel("designerHourlyRate", { currency: currency })} value={formData.designerHourlyRate} onChangeText={(text) => onInputChange("designerHourlyRate", text)} keyboardType="numeric" mode="outlined" style={styles.input} />
        </>
      )}

      <TextInput label={T.calculator.desiredMarginPercentage} value={formData.desiredMarginPercentage} onChangeText={(text) => onInputChange("desiredMarginPercentage", text)} keyboardType="numeric" mode="outlined" style={styles.input} />

      <Portal>
        <Dialog visible={materialDialogVisible} onDismiss={hideMaterialDialog}>
          <Dialog.Title>{T.calculator.selectMaterialProfile}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <ScrollView>
              <RadioButton.Group onValueChange={handleMaterialSelection} value={selectedMaterialId || ""}>
                {materialOptions.map((matOpt) => (
                  <RadioButton.Item key={matOpt.value} label={matOpt.label} value={matOpt.value} />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideMaterialDialog}>{T.common.cancel}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 16,
    width: "100%",
  },
  materialSelectContainer: {
    marginVertical: 15,
  },
  materialSelectLabel: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  touchableInput: {
    width: "100%",
  },
  dialogContent: {
    maxHeight: 300,
  },
});

export default CalculationForm;
