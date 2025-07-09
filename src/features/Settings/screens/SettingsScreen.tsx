import { CURRENCIES } from "@/src/constants/appConstants";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, TextInput, Button, SegmentedButtons, Divider, Snackbar, useTheme } from "react-native-paper";
import { ThemeMode } from "../types/settingsTypes";
import { CommonColors } from "@/src/styles/colors";

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useContext(SettingsContext);

  const [defaultHourlyRate, setDefaultHourlyRate] = useState(String(settings.defaultHourlyRate));
  const [defaultMachineDepreciationRate, setDefaultMachineDepreciationRate] = useState(String(settings.defaultMachineDepreciationRate));

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  useEffect(() => {
    setDefaultHourlyRate(String(settings.defaultHourlyRate));
    setDefaultMachineDepreciationRate(String(settings.defaultMachineDepreciationRate));
  }, [settings.defaultHourlyRate, settings.defaultMachineDepreciationRate]);

  const handleCurrencyChange = (value: string) => {
    updateSettings({ currency: value });
  };

  const handleThemeModeChange = (value: ThemeMode) => {
    updateSettings({ themeMode: value });
  };

  const handleSaveRates = async () => {
    try {
      await updateSettings({
        defaultHourlyRate: parseFloat(defaultHourlyRate.replace(",", ".")),
        defaultMachineDepreciationRate: parseFloat(defaultMachineDepreciationRate.replace(",", ".")),
      });
      onToggleSnackBar();
    } catch (error) {
      console.error("Błąd podczas zapisu stawek:", error);
    }
  };

  const parsedHourlyRate = parseFloat(defaultHourlyRate.replace(",", "."));
  const parsedMachineDepreciationRate = parseFloat(defaultMachineDepreciationRate.replace(",", "."));

  const areRatesUnchanged = parsedHourlyRate === settings.defaultHourlyRate && parsedMachineDepreciationRate === settings.defaultMachineDepreciationRate;

  const areInputsValidNumbers = !isNaN(parsedHourlyRate) && !isNaN(parsedMachineDepreciationRate) && defaultHourlyRate.trim() !== "" && defaultMachineDepreciationRate.trim() !== "";

  const currencyOptions = CURRENCIES.map((c) => ({
    value: c,
    label: c,
  }));

  const themeModeOptions: { value: ThemeMode; label: string }[] = [
    { value: "light" as ThemeMode, label: "Jasny" },
    { value: "dark" as ThemeMode, label: "Ciemny" },
    { value: "system" as ThemeMode, label: "Systemowy" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Ustawienia" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Ogólne Ustawienia
        </Text>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Domyślna Waluta:</Text>
          <SegmentedButtons<string> value={settings.currency} onValueChange={handleCurrencyChange} buttons={currencyOptions} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Tryb Wyświetlania:</Text>
          <SegmentedButtons<ThemeMode> value={settings.themeMode} onValueChange={handleThemeModeChange} buttons={themeModeOptions} />
        </View>

        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 20 }]}>
          Stawki i Amortyzacja
        </Text>
        <TextInput label="Domyślna stawka godzinowa pracy (zł/h)" value={defaultHourlyRate} onChangeText={setDefaultHourlyRate} keyboardType="numeric" mode="outlined" style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]} textColor={theme.colors.onSurface} error={!isNaN(parsedHourlyRate) && defaultHourlyRate.trim() === ""} />
        <TextInput label="Domyślna amortyzacja maszyny (zł/h)" value={defaultMachineDepreciationRate} onChangeText={setDefaultMachineDepreciationRate} keyboardType="numeric" mode="outlined" style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]} textColor={theme.colors.onSurface} error={!isNaN(parsedMachineDepreciationRate) && defaultMachineDepreciationRate.trim() === ""} />

        <Button mode="contained" onPress={handleSaveRates} style={styles.button} disabled={areRatesUnchanged || !areInputsValidNumbers} buttonColor={areRatesUnchanged || !areInputsValidNumbers ? theme.colors.backdrop : theme.colors.primary} textColor={areRatesUnchanged || !areInputsValidNumbers ? theme.colors.onBackground : theme.colors.onPrimary}>
          Zapisz Stawki
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        action={{
          label: "OK",
          textColor: CommonColors.onSuccessLight,
          onPress: () => {
            onDismissSnackBar();
          },
        }}
        style={{ backgroundColor: CommonColors.successLight }}
      >
        <Text style={{ color: CommonColors.onSuccessLight }}>Stawki zostały pomyślnie zapisane!</Text>
      </Snackbar>
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
  divider: {
    marginVertical: 20,
    height: 1,
  },
});

export default SettingsScreen;
