import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider } from "react-native-paper";
import { CalculationResultType } from "../types/calculatorTypes";
import { formatCurrency } from "@/src/utils";

interface CalculationResultsProps {
  results: CalculationResultType;
  currency: string;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({ results, currency }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="bodyLarge">Całkowity Koszt:</Text>
        <Text variant="titleLarge" style={styles.value}>
          {formatCurrency(results.totalCost, currency)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.row}>
        <Text variant="bodyLarge">Marża ({results.desiredMarginPercentage}%):</Text>
        <Text variant="titleLarge" style={styles.value}>
          {formatCurrency(results.marginValue, currency)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.row}>
        <Text variant="bodyLarge">Sugerowana Cena Sprzedaży:</Text>
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
