import { AppSettings } from "@/src/features/Settings/types/settingsTypes";

export const CURRENCIES = ["PLN", "USD", "EUR", "GBP"];

export enum ASYNC_STORAGE_KEYS {
  SETTINGS = "appSettings",
  MATERIAL_PROFILES = "materialProfiles",
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  currency: CURRENCIES[0],
  defaultHourlyRate: 50,
  defaultMachineDepreciationRate: 10,
  themeMode: "system",
  unitSystem: "metric",
  language: "pl",
};
