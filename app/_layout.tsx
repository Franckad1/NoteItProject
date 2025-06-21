import { Stack } from "expo-router";
import * as React from "react";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import "./global.css";

// Définition du thème global de l'application (basé sur Paper)
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato", // Couleur primaire utilisée par les composants Paper
    secondary: "yellow", // Couleur secondaire utilisée par les composants Paper
  },
};

// Composant racine qui gère le layout et la navigation
export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      {/* Gestion de la navigation avec un stack */}
      <Stack>
        {/* Écran principal sans header */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />

        {/* Écran de détail des notes avec un header stylisé */}
        <Stack.Screen
          name="[id]"
          options={{
            title: "Note Details", // Titre du header
            headerStyle: { backgroundColor: "#114B5F" }, // Couleur de fond du header
            headerTintColor: "#fff", // Couleur du texte et des icônes du header
            headerTitleStyle: { fontWeight: "bold" }, // Style du titre du header
            headerShadowVisible: false, // Supprime l'ombre sous le header
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
