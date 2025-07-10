import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, useTheme, Card, Button } from "react-native-paper";
import { useTranslation } from "@/src/localization/i18n";
import CalculationForm from "./CalculationForm";
import { useCalculator } from "../hooks/useCalculator";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import CalculationResults from "./CalculationResults";

const CalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const T = useTranslation();

  const { settings } = React.useContext(SettingsContext);
  const { materialProfiles } = React.useContext(MaterialProfilesContext);
  const { formData, results, handleInputChange, calculateMargin, selectedMaterial, selectMaterial } = useCalculator();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title={T.calculator.title} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <CalculationForm formData={formData} onInputChange={handleInputChange} materials={materialProfiles} selectedMaterialId={selectedMaterial?.id} onMaterialSelect={selectMaterial} currency={settings.currency} />
            <Button mode="contained" onPress={calculateMargin} style={styles.button}>
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
});

export default CalculatorScreen;
