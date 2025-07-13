import React, { useContext, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Appbar, Button, Card, IconButton, useTheme, Dialog, Portal } from "react-native-paper";
import { MaterialProfile } from "../types/materialTypes";
import { router } from "expo-router";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

const AD_FREQUENCY = 3;

const MaterialProfilesScreen: React.FC = () => {
  const theme = useTheme();
  const { materialProfiles, deleteMaterialProfile } = useContext(MaterialProfilesContext);
  const { settings } = useContext(SettingsContext);

  const T = useTranslation();

  const [operationCount, setOperationCount] = useState(0);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<(() => void) | null>(null);

  const triggerAdIfNeeded = (callback: () => void) => {
    const newCount = operationCount + 1;
    setOperationCount(newCount);

    if (newCount % AD_FREQUENCY === 0) {
      setPendingOperation(() => callback);
      setShowInterstitialAd(true);
    } else {
      callback();
    }
  };

  const handleEdit = (profile: MaterialProfile) => {
    triggerAdIfNeeded(() => {
      router.push({ pathname: "/material-profiles/[id]", params: { id: profile.id } });
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(T.common.confirmDelete, T.common.areYouSureDelete, [
      { text: T.common.cancel, style: "cancel" },
      {
        text: T.common.deleteConfirm,
        onPress: () => {
          triggerAdIfNeeded(() => {
            deleteMaterialProfile(id);
          });
        },
        style: "destructive",
      },
    ]);
  };

  const handleCloseInterstitialAd = () => {
    setShowInterstitialAd(false);
    if (pendingOperation) {
      pendingOperation();
      setPendingOperation(null);
    }
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
      <Appbar.Header>
        <Appbar.Content title={T.materialProfiles.title} />
        <Appbar.Action icon="plus" onPress={() => router.push("/material-profiles/new")} color={theme.colors.primary} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {materialProfiles.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>{T.materialProfiles.noProfilesFound}</Text>
        ) : (
          materialProfiles.map((profile) => (
            <Card
              key={profile.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
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

export default MaterialProfilesScreen;
