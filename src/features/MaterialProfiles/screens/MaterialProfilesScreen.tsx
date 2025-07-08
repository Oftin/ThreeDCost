import React, { useContext } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Appbar, Button, Card, IconButton, useTheme } from "react-native-paper";
import { MaterialProfile } from "../types/materialTypes";
import { router } from "expo-router";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";

const MaterialProfilesScreen: React.FC = () => {
  const theme = useTheme();
  const { materialProfiles, deleteMaterialProfile } = useContext(MaterialProfilesContext);

  const handleEdit = (profile: MaterialProfile) => {
    router.push({ pathname: "/material-profiles/[id]", params: { id: profile.id } });
  };

  const handleDelete = (id: string) => {
    Alert.alert("Potwierdź usunięcie", "Czy na pewno chcesz usunąć ten profil materiału?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        onPress: () => deleteMaterialProfile(id),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Profile Materiałów" />
        <Appbar.Action icon="plus" onPress={() => router.push("/material-profiles/new")} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {materialProfiles.length === 0 ? (
          <Text style={styles.emptyText}>Brak zapisanych profili materiałów. Dodaj nowy!</Text>
        ) : (
          materialProfiles.map((profile) => (
            <Card key={profile.id} style={styles.card}>
              <Card.Title
                title={profile.name}
                right={() => (
                  <View style={styles.cardActions}>
                    <IconButton icon="pencil" onPress={() => handleEdit(profile)} />
                    <IconButton icon="delete" onPress={() => handleDelete(profile.id)} />
                  </View>
                )}
              />
              <Card.Content>
                <Text>Koszt/gram: {profile.costPerGram} zł</Text>
                <Text>Gęstość: {profile.density} g/cm³</Text>
                <Text>Zużycie energii: {profile.energyConsumption} kWh/g</Text>
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
