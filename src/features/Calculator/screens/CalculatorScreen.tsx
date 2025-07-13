import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, useTheme, Card, Button, SegmentedButtons, Dialog, Portal } from "react-native-paper";
import { useTranslation } from "@/src/localization/i18n";
import CalculationForm from "./CalculationForm";
import { useCalculator } from "../hooks/useCalculator";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import CalculationResults from "./CalculationResults";

type CalculationMode = "printOnly" | "printAndDesign";

const AD_FREQUENCY = 5;

const CalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const T = useTranslation();

  const { settings } = React.useContext(SettingsContext);
  const { materialProfiles } = React.useContext(MaterialProfilesContext);
  const { formData, results, handleInputChange, calculateMargin, selectedMaterial, selectMaterial } = useCalculator();

  const [calculationMode, setCalculationMode] = React.useState<CalculationMode>("printOnly");
  const [calculationCount, setCalculationCount] = useState(0);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [adViewed, setAdViewed] = useState(false);

  const calculationModeOptions = [
    { value: "printOnly", label: T.calculator.printOnlyMode },
    { value: "printAndDesign", label: T.calculator.printAndDesignMode },
  ];

  const handleCalculationModeChange = (value: string) => {
    setCalculationMode(value as CalculationMode);
  };

  const handleCalculateMargin = async (mode: CalculationMode) => {
    const newCount = calculationCount + 1;
    setCalculationCount(newCount);

    if (newCount % AD_FREQUENCY === 0) {
      setShowInterstitialAd(true);
      setAdViewed(false);
    } else {
      await calculateMargin(mode);
      setAdViewed(true);
    }
  };

  const handleCloseInterstitialAd = async () => {
    setShowInterstitialAd(false);
    setAdViewed(true);

    await calculateMargin(calculationMode);
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
            <Button mode="contained" onPress={() => handleCalculateMargin(calculationMode)} style={styles.button}>
              {T.calculator.calculateMargin}
            </Button>
          </Card.Content>
        </Card>

        {results && adViewed && !showInterstitialAd && (
          <Card style={styles.card}>
            <Card.Title style={styles.titleResult} title={T.calculator.calculationResults} />
            <Card.Content>
              <CalculationResults results={results} currency={settings.currency} />
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={[styles.bannerAdContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.bannerAdText, { color: theme.colors.onSurfaceVariant }]}>{T.common.bannerAdPlaceholder}</Text>
      </View>

      <Portal>
        <Dialog
          visible={showInterstitialAd}
          onDismiss={() => {
            /* Reklama nie może być zamknięta bez obejrzenia */
          }}
        >
          <Dialog.Title>{T.common.interstitialAdTitle}</Dialog.Title>
          <Dialog.Content style={styles.interstitialAdContent}>
            <Text style={[styles.interstitialAdText, { color: theme.colors.onSurface }]}>{T.common.interstitialAdPlaceholder}</Text>
            <Text style={[styles.interstitialAdCountdown, { color: theme.colors.onSurfaceVariant }]}>{T.common.adCountdownText}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseInterstitialAd}>{T.common.closeAd}</Button>
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
    paddingBottom: 70,
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
  bannerAdContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  bannerAdText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  interstitialAdContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  interstitialAdText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  interstitialAdCountdown: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default CalculatorScreen;
