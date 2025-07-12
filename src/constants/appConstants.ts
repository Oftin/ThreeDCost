import { AppSettings } from "@/src/features/Settings/types/settingsTypes";

export const CURRENCIES = [
  "PLN", // Polski Złoty
  "USD", // Dolar Amerykański
  "EUR", // Euro
  "GBP", // Funt Brytyjski
  "JPY", // Jen Japoński
  "CAD", // Dolar Kanadyjski
  "AUD", // Dolar Australijski
  "CHF", // Frank Szwajcarski
  "CNY", // Juan Chiński (Renminbi)
  "BRL", // Real Brazylijski
  "INR", // Rupia Indyjska
  "SEK", // Korona Szwedzka
  "NOK", // Korona Norweska
  "DKK", // Korona Duńska
  "SGD", // Dolar Singapurski
];

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
