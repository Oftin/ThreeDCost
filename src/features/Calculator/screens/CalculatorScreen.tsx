import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, useTheme, Card, Button, SegmentedButtons } from "react-native-paper";
import { useTranslation } from "@/src/localization/i18n";
import CalculationForm from "./CalculationForm";
import { useCalculator } from "../hooks/useCalculator";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import CalculationResults from "./CalculationResults";

type CalculationMode = "printOnly" | "printAndDesign";

const CalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const T = useTranslation();

  const { settings } = React.useContext(SettingsContext);
  const { materialProfiles } = React.useContext(MaterialProfilesContext);
  const { formData, results, handleInputChange, calculateMargin, selectedMaterial, selectMaterial } = useCalculator();

  const [calculationMode, setCalculationMode] = React.useState<CalculationMode>("printOnly");

  const calculationModeOptions = [
    { value: "printOnly", label: T.calculator.printOnlyMode },
    { value: "printAndDesign", label: T.calculator.printAndDesignMode },
  ];

  const handleCalculationModeChange = (value: string) => {
    setCalculationMode(value as CalculationMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title={T.calculator.title} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.modeSelectionContainer}>
              <Text style={styles.modeSelectionLabel}>{T.calculator.selectCalculationMode}</Text>
              <SegmentedButtons value={calculationMode} onValueChange={handleCalculationModeChange} buttons={calculationModeOptions} />
            </View>

            <CalculationForm formData={formData} onInputChange={handleInputChange} materials={materialProfiles} selectedMaterialId={selectedMaterial?.id} onMaterialSelect={selectMaterial} currency={settings.currency} calculationMode={calculationMode} />
            <Button mode="contained" onPress={() => calculateMargin(calculationMode)} style={styles.button}>
              {T.calculator.calculateMargin}
            </Button>
          </Card.Content>
        </Card>
        {results && (
          <Card style={styles.card}>
            <Card.Title style={styles.titleResult} title={T.calculator.calculationResults} />
            <Card.Content>
              <CalculationResults results={results} currency={settings.currency} />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  titleResult: {
    marginTop: 32,
  },
  button: {
    marginTop: 20,
  },
  modeSelectionContainer: {
    marginBottom: 20,
  },
  modeSelectionLabel: {
    marginBottom: 8,
    fontWeight: "bold",
  },
});

export default CalculatorScreen;
