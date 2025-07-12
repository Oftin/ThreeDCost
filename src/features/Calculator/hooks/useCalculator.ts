import { useState, useCallback, useContext, useEffect } from "react";
import { FormDataType, CalculationResultType } from "../types/calculatorTypes";

import { MaterialProfilesContext } from "@/src/store/contexts/MaterialProfilesContext";
import { MaterialProfile } from "../../MaterialProfiles/types/materialTypes";
import { SettingsContext } from "@/src/store/contexts/SettingsContext";

type CalculationMode = "printOnly" | "printAndDesign";

export const useCalculator = () => {
  const { settings } = useContext(SettingsContext);
  const { materialProfiles } = useContext(MaterialProfilesContext);

  const [formData, setFormData] = useState<FormDataType>({
    materialCost: "",
    printWeight: "",
    printTimeHours: "",
    printTimeMinutes: "",
    machineDepreciationRate: String(settings.defaultMachineDepreciationRate),
    energyCostPerHour: "",
    postProcessingTimeHours: "",
    designTimeHours: "",
    designerHourlyRate: String(settings.defaultHourlyRate),
    additionalCosts: "",
    desiredMarginPercentage: "30",
  });

  const [results, setResults] = useState<CalculationResultType | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialProfile | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      machineDepreciationRate: String(settings.defaultMachineDepreciationRate),
      designerHourlyRate: String(settings.defaultHourlyRate),
    }));
  }, [settings.defaultMachineDepreciationRate, settings.defaultHourlyRate]);

  const handleInputChange = useCallback((field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const selectMaterial = useCallback(
    (materialId: string) => {
      const material = materialProfiles.find((m) => m.id === materialId);
      setSelectedMaterial(material || null);
    },
    [materialProfiles]
  );

  const calculateMargin = useCallback(
    (mode: CalculationMode) => {
      const parse = (val: string) => parseFloat(val.replace(",", ".")) || 0;

      const materialCost = parse(formData.materialCost);
      const printWeight = parse(formData.printWeight);
      const printTimeHours = parse(formData.printTimeHours);
      const printTimeMinutes = parse(formData.printTimeMinutes);

      const machineDepreciationRate = parse(formData.machineDepreciationRate);
      const energyCostPerHour = parse(formData.energyCostPerHour);
      const postProcessingTimeHours = parse(formData.postProcessingTimeHours);
      const additionalCosts = parse(formData.additionalCosts);

      const designTimeHours = parse(formData.designTimeHours);
      const designerHourlyRate = parse(formData.designerHourlyRate);
      const desiredMarginPercentage = parse(formData.desiredMarginPercentage);

      const totalPrintTime = printTimeHours + printTimeMinutes / 60;
      const materialTotalCost = materialCost * printWeight;
      const machineOperatingCost = totalPrintTime * machineDepreciationRate;
      const energyTotalCost = totalPrintTime * energyCostPerHour;

      const postProcessingCost = postProcessingTimeHours * settings.defaultHourlyRate;

      let designTotalCost = 0;
      if (mode === "printAndDesign") {
        designTotalCost = designTimeHours * designerHourlyRate;
      }

      const totalOperationalCost = materialTotalCost + machineOperatingCost + energyTotalCost + postProcessingCost + additionalCosts + designTotalCost;

      const marginValue = totalOperationalCost * (desiredMarginPercentage / 100);
      const suggestedSellingPrice = totalOperationalCost + marginValue;

      setResults({
        totalCost: totalOperationalCost,
        marginValue,
        suggestedSellingPrice,
        desiredMarginPercentage,
      });
    },
    [formData, settings]
  );

  return {
    formData,
    results,
    handleInputChange,
    calculateMargin,
    selectedMaterial,
    selectMaterial,
  };
};
