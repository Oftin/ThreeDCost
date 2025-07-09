import { AppSettings } from "@/src/features/Settings/types/settingsTypes";

export const CURRENCIES = ["PLN", "USD", "EUR", "GBP"];

export enum ASYNC_STORAGE_KEYS {
  SETTINGS = "appSettings",
  MATERIAL_PROFILES = "materialProfiles",
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  currency: CURRENCIES[0], // Domyślna waluta
  defaultHourlyRate: 50, // Domyślna stawka godzinowa
  defaultMachineDepreciationRate: 10, // Domyślna stawka amortyzacji maszyny
  themeMode: "system", // Domyślny tryb motywu: 'light' | 'dark' | 'system'
};
