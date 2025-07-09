export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  currency: string;
  defaultHourlyRate: number;
  defaultMachineDepreciationRate: number;
  themeMode: ThemeMode;
}
