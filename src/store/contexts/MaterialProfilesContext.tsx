import { ASYNC_STORAGE_KEYS } from "@/src/constants/appConstants";
import { MaterialProfile } from "@/src/features/MaterialProfiles/types/materialTypes";
import { getAsyncStorageItem, setAsyncStorageItem } from "@/src/services";
import React, { createContext, useState, useEffect, useCallback } from "react";

interface MaterialProfilesContextType {
  materialProfiles: MaterialProfile[];
  addMaterialProfile: (profile: MaterialProfile) => void;
  updateMaterialProfile: (profile: MaterialProfile) => void;
  deleteMaterialProfile: (id: string) => void;
  isLoadingProfiles: boolean;
}

export const MaterialProfilesContext = createContext<MaterialProfilesContextType>({
  materialProfiles: [],
  addMaterialProfile: () => {},
  updateMaterialProfile: () => {},
  deleteMaterialProfile: () => {},
  isLoadingProfiles: true,
});

export const MaterialProfilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materialProfiles, setMaterialProfiles] = useState<MaterialProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const storedProfiles = await getAsyncStorageItem<MaterialProfile[]>(ASYNC_STORAGE_KEYS.MATERIAL_PROFILES);
        if (storedProfiles) {
          setMaterialProfiles(storedProfiles);
        }
      } catch (error) {
        console.error("Failed to load material profiles from storage", error);
      } finally {
        setIsLoadingProfiles(false);
      }
    };
    loadProfiles();
  }, []);

  const saveProfiles = useCallback(async (profiles: MaterialProfile[]) => {
    setMaterialProfiles(profiles);
    try {
      await setAsyncStorageItem(ASYNC_STORAGE_KEYS.MATERIAL_PROFILES, profiles);
    } catch (error) {
      console.error("Failed to save material profiles to storage", error);
    }
  }, []);

  const addMaterialProfile = useCallback(
    (profile: MaterialProfile) => {
      saveProfiles([...materialProfiles, profile]);
    },
    [materialProfiles, saveProfiles]
  );

  const updateMaterialProfile = useCallback(
    (profile: MaterialProfile) => {
      saveProfiles(materialProfiles.map((p) => (p.id === profile.id ? profile : p)));
    },
    [materialProfiles, saveProfiles]
  );

  const deleteMaterialProfile = useCallback(
    (id: string) => {
      saveProfiles(materialProfiles.filter((p) => p.id !== id));
    },
    [materialProfiles, saveProfiles]
  );

  return (
    <MaterialProfilesContext.Provider
      value={{
        materialProfiles,
        addMaterialProfile,
        updateMaterialProfile,
        deleteMaterialProfile,
        isLoadingProfiles,
      }}
    >
      {children}
    </MaterialProfilesContext.Provider>
  );
};
