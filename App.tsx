// File: App.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/theme/ThemeProvider";

/**
 * App entry point.
 *
 * IMPORTANT:
 * - This file must have EXACTLY ONE default export.
 * - ThemeProvider wraps navigation so every screen/component can read the active theme.
 */
export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}