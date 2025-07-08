import { ASYNC_STORAGE_KEYS, DEFAULT_APP_SETTINGS } from "@/src/constants/appConstants";
import { AppSettings } from "@/src/features/Settings/types/settingsTypes";
import { getAsyncStorageItem, setAsyncStorageItem } from "@/src/services";
import React, { createContext, useState, useEffect, useCallback } from "react";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isLoadingSettings: boolean;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_APP_SETTINGS,
  updateSettings: () => {},
  isLoadingSettings: true,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await getAsyncStorageItem<AppSettings>(ASYNC_STORAGE_KEYS.SETTINGS);
        if (storedSettings) {
          setSettings({ ...DEFAULT_APP_SETTINGS, ...storedSettings });
        }
      } catch (error) {
        console.error("Failed to load settings from storage", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = useCallback(
    async (newPartialSettings: Partial<AppSettings>) => {
      const updated = { ...settings, ...newPartialSettings };
      setSettings(updated);
      try {
        await setAsyncStorageItem(ASYNC_STORAGE_KEYS.SETTINGS, updated);
      } catch (error) {
        console.error("Failed to save settings to storage", error);
      }
    },
    [settings]
  );

  return <SettingsContext.Provider value={{ settings, updateSettings, isLoadingSettings }}>{children}</SettingsContext.Provider>;
};
