import { useState, useEffect, useCallback, useContext } from "react";
import { MaterialProfile } from "../types/materialTypes";
import { Alert } from "react-native";
import { generateUUID } from "@/src/utils";
import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";

interface MaterialFormState {
  name: string;
  costPerGram: string;
  density: string;
  energyConsumption: string;
}

interface UseMaterialFormProps {
  profileId?: string | string[];
  onSaveSuccess?: () => void;
}

export const useMaterialForm = ({ profileId, onSaveSuccess }: UseMaterialFormProps) => {
  const { materialProfiles, addMaterialProfile, updateMaterialProfile } = useContext(MaterialProfilesContext);

  const [formData, setFormData] = useState<MaterialFormState>({
    name: "",
    costPerGram: "",
    density: "",
    energyConsumption: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileId && typeof profileId === "string" && profileId !== "new") {
      setIsEditing(true);
      const profileToEdit = materialProfiles.find((p) => p.id === profileId);
      if (profileToEdit) {
        setFormData({
          name: profileToEdit.name,
          costPerGram: String(profileToEdit.costPerGram),
          density: String(profileToEdit.density),
          energyConsumption: String(profileToEdit.energyConsumption),
        });
      } else {
        Alert.alert("Błąd", "Nie znaleziono profilu do edycji.");
      }
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        costPerGram: "",
        density: "",
        energyConsumption: "",
      });
    }
  }, [profileId, materialProfiles]);

  const handleInputChange = useCallback((field: keyof MaterialFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.name || !formData.costPerGram || !formData.density || !formData.energyConsumption) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane!");
      return;
    }

    const parsedCostPerGram = parseFloat(formData.costPerGram.replace(",", "."));
    const parsedDensity = parseFloat(formData.density.replace(",", "."));
    const parsedEnergyConsumption = parseFloat(formData.energyConsumption.replace(",", "."));

    if (isNaN(parsedCostPerGram) || isNaN(parsedDensity) || isNaN(parsedEnergyConsumption)) {
      Alert.alert("Błąd", "Wprowadź poprawne wartości liczbowe dla kosztu, gęstości i zużycia energii.");
      return;
    }

    setIsSaving(true);

    try {
      const newProfile: MaterialProfile = {
        id: isEditing ? (profileId as string) : generateUUID(),
        name: formData.name,
        costPerGram: parsedCostPerGram,
        density: parsedDensity,
        energyConsumption: parsedEnergyConsumption,
      };

      if (isEditing) {
        await updateMaterialProfile(newProfile);
      } else {
        await addMaterialProfile(newProfile);
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Błąd podczas zapisu profilu materiału:", error);
      Alert.alert("Błąd", "Wystąpił błąd podczas zapisu profilu. Spróbuj ponownie.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, isEditing, profileId, addMaterialProfile, updateMaterialProfile, onSaveSuccess]);

  return {
    formData,
    handleInputChange,
    handleSave,
    isEditing,
    isSaving,
  };
};
