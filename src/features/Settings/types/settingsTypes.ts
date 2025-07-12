export type ThemeMode = "light" | "dark" | "system";
export type UnitSystem = "metric" | "imperial";
export type Language = "pl" | "en" | "zh" | "es" | "fr" | "de" | "pt-BR" | "pt-PT" | "ja" | "ko" | "ru" | "ar" | "hi";

export interface AppSettings {
  currency: string;
  defaultHourlyRate: number;
  defaultMachineDepreciationRate: number;
  themeMode: ThemeMode;
  unitSystem: UnitSystem;
  language: Language;
}
