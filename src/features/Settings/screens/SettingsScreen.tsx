import { CURRENCIES } from "@/src/constants/appConstants";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, TextInput, Button, useTheme, SegmentedButtons } from "react-native-paper";

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useContext(SettingsContext);

  const [currency, setCurrency] = useState(settings.currency);
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(String(settings.defaultHourlyRate));
  const [defaultMachineDepreciationRate, setDefaultMachineDepreciationRate] = useState(String(settings.defaultMachineDepreciationRate));

  const handleSaveSettings = () => {
    updateSettings({
      currency: currency,
      defaultHourlyRate: parseFloat(defaultHourlyRate),
      defaultMachineDepreciationRate: parseFloat(defaultMachineDepreciationRate),
    });
  };

  const currencyOptions = CURRENCIES.map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Ustawienia" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Ogólne Ustawienia
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Domyślna Waluta:</Text>
          <SegmentedButtons value={currency} onValueChange={setCurrency} buttons={currencyOptions} />
        </View>

        <TextInput label="Domyślna stawka godzinowa pracy (zł/h)" value={defaultHourlyRate} onChangeText={setDefaultHourlyRate} keyboardType="numeric" mode="outlined" style={styles.input} />
        <TextInput label="Domyślna amortyzacja maszyny (zł/h)" value={defaultMachineDepreciationRate} onChangeText={setDefaultMachineDepreciationRate} keyboardType="numeric" mode="outlined" style={styles.input} />

        <Button mode="contained" onPress={handleSaveSettings} style={styles.button}>
          Zapisz Ustawienia
        </Button>
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
  sectionTitle: {
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  },
});

export default SettingsScreen;
