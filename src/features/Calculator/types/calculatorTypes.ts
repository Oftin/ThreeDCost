export interface FormDataType {
  materialCost: string; // Koszt materiału np. na gram (zł/g)
  printWeight: string; // Waga wydruku w gramach
  printTimeHours: string;
  printTimeMinutes: string;
  machineDepreciationRate: string; // Koszt amortyzacji maszyny na godzinę (zł/h)
  energyCostPerHour: string; // Koszt energii na godzinę (zł/h)
  postProcessingTimeHours: string; // Czas post-processing
  additionalCosts: string; // Opakowanie, wysyłka, itp.
  designTimeHours: string;
  designerHourlyRate: string;
  desiredMarginPercentage: string; // % marży
}

export interface CalculationResultType {
  totalCost: number;
  marginValue: number;
  suggestedSellingPrice: number;
  desiredMarginPercentage: number;
}
