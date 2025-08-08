import { CURRENCIES } from "@/src/constants/appConstants";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, Appbar, TextInput, Button, SegmentedButtons, Divider, Snackbar, useTheme, Dialog, Portal, RadioButton } from "react-native-paper";
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
  const [currencyDialogVisible, setCurrencyDialogVisible] = useState(false);
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const showCurrencyDialog = () => {
    console.log("Attempting to show currency dialog");
    setCurrencyDialogVisible(true);
  };
  const hideCurrencyDialog = () => setCurrencyDialogVisible(false);
  const showLanguageDialog = () => {
    console.log("Attempting to show language dialog");
    setLanguageDialogVisible(true);
  };
  const hideLanguageDialog = () => setLanguageDialogVisible(false);

  useEffect(() => {
    setDefaultHourlyRate(String(settings.defaultHourlyRate));
    setDefaultMachineDepreciationRate(String(settings.defaultMachineDepreciationRate));
  }, [settings.defaultHourlyRate, settings.defaultMachineDepreciationRate]);

  const handleCurrencyChange = (value: string) => {
    updateSettings({ currency: value });
    hideCurrencyDialog();
  };

  const handleThemeModeChange = (value: ThemeMode) => {
    updateSettings({ themeMode: value });
  };

  const handleUnitSystemChange = (value: UnitSystem) => {
    updateSettings({ unitSystem: value });
  };

  const handleLanguageChange = (value: string) => {
    updateSettings({ language: value as Language });
    hideLanguageDialog();
  };

  const handleSaveRates = async () => {
    const parsedHourlyRate = parseFloat(defaultHourlyRate.replace(",", "."));
    const parsedMachineDepreciationRate = parseFloat(defaultMachineDepreciationRate.replace(",", "."));

    if (isNaN(parsedHourlyRate) || defaultHourlyRate.trim() === "" || isNaN(parsedMachineDepreciationRate) || defaultMachineDepreciationRate.trim() === "") {
      Alert.alert(T.common.error, T.settings.invalidNumberError, [{ text: T.common.ok }]);
      return;
    }

    try {
      await updateSettings({
        defaultHourlyRate: parsedHourlyRate,
        defaultMachineDepreciationRate: parsedMachineDepreciationRate,
      });
      onToggleSnackBar();
    } catch (error) {
      console.error("Błąd podczas zapisu stawek:", error);
      Alert.alert(T.common.error, T.settings.errorSavingRates, [{ text: T.common.ok }]);
    }
  };

  const parsedHourlyRate = parseFloat(defaultHourlyRate.replace(",", "."));
  const parsedMachineDepreciationRate = parseFloat(defaultMachineDepreciationRate.replace(",", "."));

  const areRatesUnchanged = parsedHourlyRate === settings.defaultHourlyRate && parsedMachineDepreciationRate === settings.defaultMachineDepreciationRate;

  const areInputsValidNumbers = !isNaN(parsedHourlyRate) && defaultHourlyRate.trim() !== "" && !isNaN(parsedMachineDepreciationRate) && defaultMachineDepreciationRate.trim() !== "";

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
    { value: "pl", label: T.settings.polish || "Polski" },
    { value: "en", label: T.settings.english || "English" },
    { value: "zh", label: T.settings.chinese || "中文" },
    { value: "es", label: T.settings.spanish || "Español" },
    { value: "fr", label: T.settings.french || "Français" },
    { value: "de", label: T.settings.german || "Deutsch" },
    { value: "pt-BR", label: T.settings.portugueseBrazil || "Português (Brasil)" },
    { value: "pt-PT", label: T.settings.portuguesePortugal || "Português (Portugal)" },
    { value: "ja", label: T.settings.japanese || "日本語" },
    { value: "ko", label: T.settings.korean || "한국어" },
    { value: "ru", label: T.settings.russian || "Русский" },
    { value: "ar", label: T.settings.arabic || "العربية" },
    { value: "hi", label: T.settings.hindi || "हिन्दी" },
  ];

  const getTranslatedLabel = (key: keyof typeof T.settings, replacements?: { [key: string]: string | number }) => {
    let label = T.settings[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  const defaultHourlyRateLabel = settings.unitSystem === "metric" ? getTranslatedLabel("defaultHourlyRate", { currency: settings.currency, unit: "kg" }) : getTranslatedLabel("defaultHourlyRate", { currency: settings.currency, unit: "lb" });
  const defaultMachineDepreciationRateLabel = settings.unitSystem === "metric" ? getTranslatedLabel("defaultMachineDepreciationRate", { currency: settings.currency, unit: "g" }) : getTranslatedLabel("defaultMachineDepreciationRate", { currency: settings.currency, unit: "oz" });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[{ backgroundColor: theme.colors.elevation.level5 }]}>
        <Appbar.Content title={T.settings.title} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          {T.settings.generalSettings}
        </Text>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{T.settings.defaultCurrency}</Text>
          <TouchableOpacity onPress={showCurrencyDialog} style={styles.touchableInput}>
            <TextInput value={settings.currency} mode="outlined" editable={false} right={<TextInput.Icon icon="menu-down" />} style={[styles.inputField, { backgroundColor: theme.colors.surface }]} textColor={theme.colors.onSurface} pointerEvents="none" />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={showLanguageDialog} style={styles.touchableInput}>
            <TextInput value={languageOptions.find((opt) => opt.value === settings.language)?.label || settings.language} mode="outlined" editable={false} right={<TextInput.Icon icon="menu-down" />} style={[styles.inputField, { backgroundColor: theme.colors.surface }]} textColor={theme.colors.onSurface} pointerEvents="none" />
          </TouchableOpacity>
        </View>

        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 20 }]}>
          {T.settings.ratesAndDepreciation}
        </Text>
        <TextInput label={defaultHourlyRateLabel} value={defaultHourlyRate} onChangeText={setDefaultHourlyRate} keyboardType="numeric" mode="outlined" style={styles.inputField} textColor={theme.colors.onSurface} error={!areInputsValidNumbers && defaultHourlyRate.trim() === ""} />
        <TextInput label={defaultMachineDepreciationRateLabel} value={defaultMachineDepreciationRate} onChangeText={setDefaultMachineDepreciationRate} keyboardType="numeric" mode="outlined" style={styles.inputField} textColor={theme.colors.onSurface} error={!areInputsValidNumbers && defaultMachineDepreciationRate.trim() === ""} />

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

      <Portal>
        <Dialog visible={currencyDialogVisible} onDismiss={hideCurrencyDialog}>
          <Dialog.Title>{T.settings.defaultCurrency}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <ScrollView>
              <RadioButton.Group onValueChange={handleCurrencyChange} value={settings.currency}>
                {CURRENCIES.map((c) => (
                  <RadioButton.Item key={c} label={c} value={c} />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideCurrencyDialog}>{T.common.cancel}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={languageDialogVisible} onDismiss={hideLanguageDialog}>
          <Dialog.Title>{T.settings.language}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <ScrollView>
              <RadioButton.Group onValueChange={handleLanguageChange} value={settings.language}>
                {languageOptions.map((langOpt) => (
                  <RadioButton.Item key={langOpt.value} label={langOpt.label} value={langOpt.value} />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideLanguageDialog}>{T.common.cancel}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  inputField: {
    marginBottom: 16,
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  },
  divider: {
    height: 1,
  },
  touchableInput: {
    width: "100%",
  },
  dialogContent: {
    maxHeight: 300,
  },
});

export default SettingsScreen;
