export type ThemeMode = "light" | "dark" | "system";
export type UnitSystem = "metric" | "imperial";
export type Language = "pl" | "en" | "zh";

export interface AppSettings {
  currency: string;
  defaultHourlyRate: number;
  defaultMachineDepreciationRate: number;
  themeMode: ThemeMode;
  unitSystem: UnitSystem;
  language: Language;
}
