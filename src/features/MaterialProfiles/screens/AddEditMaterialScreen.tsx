import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useMaterialForm } from "../hooks/useMaterialForm";
import MaterialForm from "../components/MaterialForm";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: process.env.EXPO_IOS_BANNER_AD_UNIT_ID,
      android: process.env.EXPO_ANDROID_BANNER_AD_UNIT_ID,
    });

const AddEditMaterialScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const T = useTranslation();
  const { settings } = React.useContext(SettingsContext);

  const { formData, handleInputChange, handleSave, isEditing, isSaving } = useMaterialForm({
    profileId: id,
    onSaveSuccess: () => {
      router.back();
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[{ backgroundColor: theme.colors.elevation.level5 }]}>
        {Platform.OS === "ios" ? (
          <Appbar.Content title={isEditing ? T.materialProfiles.editProfile : T.materialProfiles.addProfile} />
        ) : (
          <>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title={isEditing ? T.materialProfiles.editProfile : T.materialProfiles.addProfile} />
          </>
        )}

        {Platform.OS === "ios" && <Appbar.Action icon="close" onPress={() => router.back()} />}
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <MaterialForm formData={formData} onInputChange={handleInputChange} onSave={handleSave} isEditing={isEditing} isSaving={isSaving} currency={settings.currency} />
      </View>

      <View style={styles.bannerAdContainer}>
        <BannerAd
          unitId={bannerAdUnitId as string}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => console.log("AdMobBanner loaded!")}
          onAdFailedToLoad={(error) => console.error("AdMobBanner failed to load:", error)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  contentContainer: {
    flex: 1,
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
  },
});

export default AddEditMaterialScreen;
