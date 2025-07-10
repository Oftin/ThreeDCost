import { CURRENCIES } from "@/src/constants/appConstants";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, TextInput, Button, SegmentedButtons, Divider, Snackbar, useTheme } from "react-native-paper";
import { Language, ThemeMode, UnitSystem } from "../types/settingsTypes";
import { useTranslation } from "@/src/localization/i18n";
import { CommonColors } from "@/src/styles/colors";

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useContext(SettingsContext);

  const T = useTranslation();

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

  const handleUnitSystemChange = (value: UnitSystem) => {
    updateSettings({ unitSystem: value });
  };

  const handleLanguageChange = (value: Language) => {
    updateSettings({ language: value });
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
    { value: "light" as ThemeMode, label: T.settings.light },
    { value: "dark" as ThemeMode, label: T.settings.dark },
    { value: "system" as ThemeMode, label: T.settings.system },
  ];

  const unitSystemOptions: { value: UnitSystem; label: string }[] = [
    { value: "metric" as UnitSystem, label: T.settings.metric },
    { value: "imperial" as UnitSystem, label: T.settings.imperial },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: "pl" as Language, label: T.settings.polish },
    { value: "en" as Language, label: T.settings.english },
    { value: "zh" as Language, label: T.settings.chinese },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title={T.settings.title} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          {T.settings.generalSettings}
        </Text>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{T.settings.defaultCurrency}</Text>
          <SegmentedButtons<string> value={settings.currency} onValueChange={handleCurrencyChange} buttons={currencyOptions} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{T.settings.displayMode}</Text>
          <SegmentedButtons<ThemeMode> value={settings.themeMode} onValueChange={handleThemeModeChange} buttons={themeModeOptions} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{T.settings.unitSystem}</Text>
          <SegmentedButtons<UnitSystem> value={settings.unitSystem} onValueChange={handleUnitSystemChange} buttons={unitSystemOptions} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{T.settings.language}</Text>
          <SegmentedButtons<Language> value={settings.language} onValueChange={handleLanguageChange} buttons={languageOptions} />
        </View>

        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 20 }]}>
          {T.settings.ratesAndDepreciation}
        </Text>
        <TextInput label={T.settings.defaultHourlyRate} value={defaultHourlyRate} onChangeText={setDefaultHourlyRate} keyboardType="numeric" mode="outlined" style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]} textColor={theme.colors.onSurface} error={!isNaN(parsedHourlyRate) && defaultHourlyRate.trim() === ""} />
        <TextInput label={T.settings.defaultMachineDepreciationRate} value={defaultMachineDepreciationRate} onChangeText={setDefaultMachineDepreciationRate} keyboardType="numeric" mode="outlined" style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]} textColor={theme.colors.onSurface} error={!isNaN(parsedMachineDepreciationRate) && defaultMachineDepreciationRate.trim() === ""} />

        <Button mode="contained" onPress={handleSaveRates} style={styles.button} disabled={areRatesUnchanged || !areInputsValidNumbers} buttonColor={areRatesUnchanged || !areInputsValidNumbers ? theme.colors.backdrop : theme.colors.primary} textColor={areRatesUnchanged || !areInputsValidNumbers ? theme.colors.onBackground : theme.colors.onPrimary}>
          {T.settings.saveRates}
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={1500}
        action={{
          label: T.settings.ok,
          textColor: CommonColors.onSuccessLight,
          onPress: () => {
            onDismissSnackBar();
          },
        }}
        style={{ backgroundColor: CommonColors.successLight }}
      >
        <Text style={{ color: CommonColors.onSuccessLight }}>{T.settings.ratesSavedSuccess}</Text>
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
