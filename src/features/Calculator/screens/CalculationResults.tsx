import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider } from "react-native-paper";
import { CalculationResultType } from "../types/calculatorTypes";
import { formatCurrency } from "@/src/utils";
import { useTranslation } from "@/src/localization/i18n";

interface CalculationResultsProps {
  results: CalculationResultType;
  currency: string;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({ results, currency }) => {
  const T = useTranslation();

  const getTranslatedLabel = (key: keyof typeof T.calculator, replacements?: { [key: string]: string | number }) => {
    let label = T.calculator[key] || key;
    if (replacements) {
      for (const placeholder in replacements) {
        label = label.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return label;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="bodyLarge">{T.calculator.totalCost}</Text>
        <Text variant="titleLarge" style={styles.value}>
          {formatCurrency(results.totalCost, currency)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.row}>
        <Text variant="bodyLarge">{getTranslatedLabel("margin", { percentage: results.desiredMarginPercentage })}</Text>
        <Text variant="titleLarge" style={styles.value}>
          {formatCurrency(results.marginValue, currency)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.row}>
        <Text variant="bodyLarge">{T.calculator.suggestedSellingPrice}</Text>
        <Text variant="headlineSmall" style={styles.value}>
          {formatCurrency(results.suggestedSellingPrice, currency)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
});

export default CalculationResults;
