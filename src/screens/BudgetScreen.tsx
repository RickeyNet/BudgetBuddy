/**
 * BudgetBuddy — Budget Screen
 * File: src/screens/BudgetScreen.tsx
 *
 * Placeholder screen for the Budget tab.
 * Will be expanded in Phase 2 to include:
 * - Income and expense tracking by category
 * - Monthly budget limits per category
 * - Visual breakdown (pie/donut chart)
 * - Spending alerts when approaching limits
 *
 * Currently displays a styled placeholder that matches the app theme,
 * so the navigation feels complete even before this screen is built out.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

const BudgetScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={styles.titleSection}>
        <Text style={styles.appLabel}>BUDGETBUDDY</Text>
        <Text style={styles.screenTitle}>Budget</Text>
        <Text style={styles.screenSubtitle}>
          Track income, expenses, and spending limits.
        </Text>
      </View>

      {/* ── Coming Soon Card ── */}
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderEmoji}>💰</Text>
        <Text style={styles.placeholderTitle}>Coming Soon</Text>
        <Text style={styles.placeholderText}>
          This screen will include monthly budget tracking, expense categories
          with visual breakdowns, and spending alerts.
        </Text>

        {/* Feature preview pills */}
        <View style={styles.featureRow}>
          {["Income Tracking", "Expense Categories", "Spending Alerts"].map(
            (feature) => (
              <View key={feature} style={styles.featurePill}>
                <Text style={styles.featurePillText}>{feature}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
  },
  titleSection: {
    paddingTop: 56,
    paddingBottom: 20,
  },
  appLabel: {
    fontSize: 12,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  placeholderCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  featurePill: {
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featurePillText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "600",
  },
});

export default BudgetScreen;
