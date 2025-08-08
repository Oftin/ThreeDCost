import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { Text, Appbar, Card, IconButton, useTheme } from "react-native-paper";
import { MaterialProfile } from "../types/materialTypes";
import { router } from "expo-router";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import mobileAds, { BannerAd, BannerAdSize, TestIds, RewardedInterstitialAd, RewardedAdEventType, AdEventType } from "react-native-google-mobile-ads";

const AD_FREQUENCY = 5;
const ACTION_COUNT_KEY = "material_profiles_action_count";

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

const MaterialProfilesScreen: React.FC = () => {
  const theme = useTheme();
  const { materialProfiles, deleteMaterialProfile } = useContext(MaterialProfilesContext);
  const { settings } = useContext(SettingsContext);
  const T = useTranslation();

  const [actionCount, setActionCount] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const loadActionCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem(ACTION_COUNT_KEY);
      if (storedCount) {
        console.log("material_profiles_action_count: ", storedCount);
        setActionCount(parseInt(storedCount, 10));
      }
    } catch (e) {
      console.error("Failed to load action count:", e);
    }
  };

  const saveActionCount = async (count: number) => {
    try {
      await AsyncStorage.setItem(ACTION_COUNT_KEY, count.toString());
    } catch (e) {
      console.error("Failed to save action count:", e);
    }
  };

  useEffect(() => {
    loadActionCount();
    mobileAds().initialize();

    const unsubscribeEarnedReward = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
        saveActionCount(0);
        setActionCount(0);
      }
    });

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (pendingAction) {
        Alert.alert(T.common.adErrorTitle, "T.common.adInterruptedMessage");
        setPendingAction(null);
      }
      rewardedInterstitial.load();
    });

    rewardedInterstitial.load();

    return () => {
      unsubscribeEarnedReward();
      unsubscribeClosed();
    };
  }, [pendingAction]);

  const handleAdAction = (callback: () => void) => {
    const newCount = actionCount + 1;
    saveActionCount(newCount);
    setActionCount(newCount);

    if (newCount >= AD_FREQUENCY) {
      if (rewardedInterstitial.loaded) {
        setPendingAction(() => callback);
        rewardedInterstitial.show();
      } else {
        Alert.alert(T.common.adErrorTitle, "T.common.adNotReadyMessage");

        callback();
      }
    } else {
      callback();
    }
  };

  const handleEdit = (profile: MaterialProfile) => {
    handleAdAction(() => {
      router.push({ pathname: "/material-profiles/[id]", params: { id: profile.id } });
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(T.common.confirmDelete, T.common.areYouSureDelete, [
      { text: T.common.cancel, style: "cancel" },
      {
        text: T.common.deleteConfirm,
        onPress: () => deleteMaterialProfile(id),
        style: "destructive",
      },
    ]);
  };

  const handleAdd = () => {
    handleAdAction(() => {
      router.push("/material-profiles/new");
    });
  };

  const getTranslatedLabel = (key: keyof typeof T.materialProfiles, replacements?: { [key: string]: string | number }) => {
    let label = T.materialProfiles[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  const formatValueWithCurrency = (value: number | string, currencySymbol: string) => {
    return `${Number(value).toFixed(2)} ${currencySymbol}`;
  };

  const densityLabel = settings.unitSystem === "metric" ? T.materialProfiles.densityLabelMetric : T.materialProfiles.densityLabelImperial;
  const energyConsumptionLabel = settings.unitSystem === "metric" ? T.materialProfiles.energyConsumptionLabelMetric : T.materialProfiles.energyConsumptionLabelImperial;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level5 }}>
        <Appbar.Content title={T.materialProfiles.title} />
        <Appbar.Action icon="plus" onPress={handleAdd} color={theme.colors.primary} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {materialProfiles.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>{T.materialProfiles.noProfilesFound}</Text>
        ) : (
          materialProfiles.map((profile) => (
            <Card key={profile.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Title
                title={profile.name}
                titleStyle={{ color: theme.colors.onSurface }}
                right={() => (
                  <View style={styles.cardActions}>
                    <IconButton icon="pencil" onPress={() => handleEdit(profile)} iconColor={theme.colors.onSurfaceVariant} />
                    <IconButton icon="delete" onPress={() => handleDelete(profile.id)} iconColor={theme.colors.error} />
                  </View>
                )}
              />
              <Card.Content>
                <Text style={{ color: theme.colors.onSurface }}>
                  {getTranslatedLabel("costPerGram", { currency: settings.currency })}: {formatValueWithCurrency(profile.costPerGram, settings.currency)}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  {densityLabel}: {profile.density} {settings.unitSystem === "metric" ? "g/cm³" : "lb/in³"}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  {energyConsumptionLabel}: {profile.energyConsumption} {settings.unitSystem === "metric" ? "kWh/g" : "kWh/lb"}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.bannerAdContainer}>
        <BannerAd unitId={bannerAdUnitId as string} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{ requestNonPersonalizedAdsOnly: true }} />
      </View>
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
    elevation: 2,
    borderRadius: 8,
  },
  cardActions: {
    flexDirection: "row",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
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

export default MaterialProfilesScreen;
