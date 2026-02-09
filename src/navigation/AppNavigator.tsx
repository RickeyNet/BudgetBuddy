/**
 * BudgetBuddy — App Navigator
 * File: src/navigation/AppNavigator.tsx
 *
 * Sets up the bottom tab navigation for the app.
 * Contains 4 tabs:
 *   1. Debt Tracker (📊) — default/home screen
 *   2. Budget (💰)       — income & expense tracking
 *   3. Investments (📈)  — growth projections
 *   4. Profile (👤)      — anonymous account & settings
 *
 * Design decisions:
 * - Uses @react-navigation/bottom-tabs for native tab bar behavior
 * - Tab bar is styled to match the dark theme with a frosted glass effect
 * - Icons are emoji-based for now (swap for vector icons later if desired)
 * - headerShown: false on all screens — each screen manages its own header
 *
 * Performance:
 * - lazy: true (default) — screens only mount when first visited
 * - Tab bar uses a static style object to avoid re-creation each render
 */

import React from "react";
import { Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types";
import { COLORS } from "../theme/colors";

/* ── Screen Imports ── */
import DebtTrackerScreen from "../screens/DebtTrackerScreen";
import BudgetScreen from "../screens/BudgetScreen";
import InvestmentScreen from "../screens/InvestmentScreen";
import ProfileScreen from "../screens/ProfileScreen";

/** Create the typed tab navigator */
const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Tab icon configuration.
 * Maps each route name to its emoji icon.
 * Using a lookup object is faster than a switch statement.
 */
const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  DebtTracker: "⛓️",
  Budget: "💰",
  Investments: "📈",
  Profile: "👤",
};

/**
 * Tab display labels.
 * Shortened versions of screen names for the tab bar.
 */
const TAB_LABELS: Record<keyof RootTabParamList, string> = {
  DebtTracker: "Debts",
  Budget: "Budget",
  Investments: "Invest",
  Profile: "Profile",
};

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="DebtTracker"
      screenOptions={({ route }) => ({
        /** Hide the default header — each screen has its own */
        headerShown: false,

        /** Tab bar icon — emoji based */
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.icon, !focused && styles.iconInactive]}>
            {TAB_ICONS[route.name as keyof RootTabParamList]}
          </Text>
        ),

        /** Tab bar label */
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
            {TAB_LABELS[route.name as keyof RootTabParamList]}
          </Text>
        ),

        /** Tab bar styling — dark theme with subtle border */
        tabBarStyle: styles.tabBar,

        /** Active indicator color (used on some platforms) */
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
      })}
    >
      <Tab.Screen name="DebtTracker" component={DebtTrackerScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Investments" component={InvestmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: `${COLORS.card}ee`,
    borderTopColor: COLORS.cardBorder,
    borderTopWidth: 1,
    height: 70,
    paddingTop: 8,
    paddingBottom: 12,
    position: "absolute",
    elevation: 0,
  },
  icon: {
    fontSize: 22,
  },
  iconInactive: {
    opacity: 0.4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  labelActive: {
    color: COLORS.accent,
  },
  labelInactive: {
    color: COLORS.textMuted,
  },
});

export default AppNavigator;
