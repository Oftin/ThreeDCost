import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Appbar, TextInput, Button, Card, useTheme } from "react-native-paper";
import CalculationForm from "./CalculationForm";
import CalculationResults from "./CalculationResults";
import { useCalculator } from "../hooks/useCalculator";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

const CalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const { settings } = React.useContext(SettingsContext);
  const { materialProfiles } = React.useContext(MaterialProfilesContext);
  const { formData, results, handleInputChange, calculateMargin, selectedMaterial, selectMaterial } = useCalculator();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Kalkulator Marży" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Parametry Kalkulacji" />
          <Card.Content>
            <CalculationForm formData={formData} onInputChange={handleInputChange} materials={materialProfiles} selectedMaterialId={selectedMaterial?.id} onMaterialSelect={selectMaterial} currency={settings.currency} />
            <Button mode="contained" onPress={calculateMargin} style={styles.button}>
              Oblicz Marżę
            </Button>
          </Card.Content>
        </Card>

        {results && (
          <Card style={styles.card}>
            <Card.Title title="Wyniki Kalkulacji" />
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
  button: {
    marginTop: 20,
  },
});

export default CalculatorScreen;
