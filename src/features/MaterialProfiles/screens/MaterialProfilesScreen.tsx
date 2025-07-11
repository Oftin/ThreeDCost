import React, { useContext } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Appbar, Button, Card, IconButton, useTheme } from "react-native-paper";
import { MaterialProfile } from "../types/materialTypes";
import { router } from "expo-router";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { useTranslation } from "@/src/localization/i18n";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

const MaterialProfilesScreen: React.FC = () => {
  const theme = useTheme();
  const { materialProfiles, deleteMaterialProfile } = useContext(MaterialProfilesContext);
  const { settings } = useContext(SettingsContext);

  const T = useTranslation();

  const handleEdit = (profile: MaterialProfile) => {
    router.push({ pathname: "/material-profiles/[id]", params: { id: profile.id } });
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
                  {T.materialProfiles.densityLabel}: {profile.density}
                </Text>
                <Text style={{ color: theme.colors.onSurface }}>
                  {T.materialProfiles.energyConsumptionLabel}: {profile.energyConsumption}
                </Text>
              </Card.Content>
            </Card>
          ))
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
});

export default MaterialProfilesScreen;
