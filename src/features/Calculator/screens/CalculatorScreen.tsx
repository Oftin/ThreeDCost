import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import { Text, Appbar, useTheme, Card, Button, SegmentedButtons, Dialog, Portal } from "react-native-paper";
import { useTranslation } from "@/src/localization/i18n";
import CalculationForm from "./CalculationForm";
import { useCalculator } from "../hooks/useCalculator";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import CalculationResults from "./CalculationResults";
import AsyncStorage from "@react-native-async-storage/async-storage";

import mobileAds, { BannerAd, BannerAdSize, RewardedInterstitialAd, RewardedAdEventType, AdEventType, TestIds } from "react-native-google-mobile-ads";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

type CalculationMode = "printOnly" | "printAndDesign";

const AD_FREQUENCY = 5;
const CLICK_COUNT_KEY = "calculation_click_count";

const rewardedInterstitialAdUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : Platform.select({
      ios: process.env.EXPO_IOS_REWARDED_INTERSTITIAL_AD_UNIT_ID,
      android: process.env.EXPO_ANDROID_REWARDED_INTERSTITIAL_AD_UNIT_ID,
    });

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: process.env.EXPO_IOS_BANNER_AD_UNIT_ID,
      android: process.env.EXPO_ANDROID_BANNER_AD_UNIT_ID,
    });

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(rewardedInterstitialAdUnitId as string, {
  requestNonPersonalizedAdsOnly: true,
});

const CalculatorScreen: React.FC = () => {
  const theme = useTheme();
  const T = useTranslation();

  const { settings } = React.useContext(SettingsContext);
  const { materialProfiles } = React.useContext(MaterialProfilesContext);
  const { formData, results, handleInputChange, calculateMargin, selectedMaterial, selectMaterial } = useCalculator();

  const [calculationMode, setCalculationMode] = React.useState<CalculationMode>("printOnly");
  const [calculationCount, setCalculationCount] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showCalculationResults, setShowCalculationResults] = useState(false);
  const [showAdLoadingDialog, setShowAdLoadingDialog] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const resultsCardRef = useRef<View>(null);

  const loadClickCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem(CLICK_COUNT_KEY);
      if (storedCount) {
        setCalculationCount(parseInt(storedCount, 10));
      }
    } catch (e) {
      console.error("Failed to load click count:", e);
    }
  };

  const saveClickCount = async (count: number) => {
    try {
      await AsyncStorage.setItem(CLICK_COUNT_KEY, count.toString());
    } catch (e) {
      console.error("Failed to save click count:", e);
    }
  };

  const handleCalculationModeChange = (value: string) => {
    setCalculationMode(value as CalculationMode);
  };

  useEffect(() => {
    loadClickCount();
    mobileAds().initialize();

    const unsubscribeEarnedReward = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
        saveClickCount(0);
        setCalculationCount(0);
      }
    });

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (pendingAction) {
        Alert.alert(T.common.adErrorTitle, "T.common.adInterruptedMessage");
        setPendingAction(null);
      }
      setShowAdLoadingDialog(false);
      rewardedInterstitial.load();
    });

    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => setShowAdLoadingDialog(false));

    const unsubscribeFailedToLoad = rewardedInterstitial.addAdEventListener(AdEventType.ERROR, () => {
      Alert.alert(T.common.adErrorTitle, T.common.adErrorMessage);
      setShowAdLoadingDialog(false);
      rewardedInterstitial.load();
    });

    rewardedInterstitial.load();

    return () => {
      unsubscribeEarnedReward();
      unsubscribeClosed();
      unsubscribeLoaded();
      unsubscribeFailedToLoad();
    };
  }, [pendingAction]);

  useEffect(() => {
    if (showCalculationResults) {
      if (resultsCardRef.current && scrollViewRef.current) {
        resultsCardRef.current.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({ y: pageY, animated: true });
        });
      }
    }
  }, [showCalculationResults]);

  const handleCalculate = async () => {
    const newCount = calculationCount + 1;
    saveClickCount(newCount);
    setCalculationCount(newCount);
    setShowCalculationResults(false);

    const performCalculation = () => {
      calculateMargin(calculationMode);
      setShowCalculationResults(true);
    };

    if (newCount >= AD_FREQUENCY) {
      if (rewardedInterstitial.loaded) {
        setPendingAction(() => performCalculation);
        rewardedInterstitial.show();
      } else {
        setShowAdLoadingDialog(true);
        setPendingAction(() => performCalculation);
      }
    } else {
      performCalculation();
    }
  };

  const calculationModeOptions = [
    { value: "printOnly", label: T.calculator.printOnlyMode },
    { value: "printAndDesign", label: T.calculator.printAndDesignMode },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[{ backgroundColor: theme.colors.elevation.level5 }]}>
        <Appbar.Content title={T.calculator.title} />
      </Appbar.Header>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.modeSelectionContainer}>
              <Text style={styles.modeSelectionLabel}>{T.calculator.selectCalculationMode}</Text>
              <SegmentedButtons value={calculationMode} onValueChange={handleCalculationModeChange} buttons={calculationModeOptions} />
            </View>

            <CalculationForm formData={formData} onInputChange={handleInputChange} materials={materialProfiles} selectedMaterialId={selectedMaterial?.id} onMaterialSelect={selectMaterial} currency={settings.currency} calculationMode={calculationMode} />
            <Button mode="contained" onPress={handleCalculate} style={styles.button}>
              {T.calculator.calculateMargin}
            </Button>
          </Card.Content>
        </Card>

        {showCalculationResults && results && (
          <Card ref={resultsCardRef} style={styles.card}>
            <Card.Title style={styles.titleResult} title={T.calculator.calculationResults} />
            <Card.Content>
              <CalculationResults results={results} currency={settings.currency} />
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={styles.bannerAdContainer}>
        <BannerAd unitId={bannerAdUnitId as string} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{ requestNonPersonalizedAdsOnly: true }} />
      </View>

      <Portal>
        <Dialog visible={showAdLoadingDialog} onDismiss={() => {}}>
          <Dialog.Title>{T.common.adLoadingTitle}</Dialog.Title>
          <Dialog.Content>
            <Text>{T.common.adLoadingMessage}</Text>
          </Dialog.Content>
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
  titleResult: {},
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
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
});

export default CalculatorScreen;
