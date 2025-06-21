import { Stack } from "expo-router";
import * as React from "react";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import "./global.css";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};
export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="[id]" options={{ title: "Note Details" }} />
      </Stack>
    </PaperProvider>
  );
}
