import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

// Composant pour afficher l'icône des onglets
const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    // Si l'onglet est actif : image avec fond surligné et titre
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full 
                flex-1 min-w-[112px] min-h-16 mt-4 justify-center 
                items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold">{title}</Text>
      </ImageBackground>
    );
  }
  // Si l'onglet n'est pas actif : icône seule avec couleur spécifique
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#7EE4EC" />
    </View>
  );
};

// Composant principal des onglets de navigation
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        // Désactive les labels sous les icônes
        tabBarShowLabel: false,
        // Style appliqué à chaque élément de l'onglet
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          alignItems: "center",
        },
        // Style de la barre des onglets
        tabBarStyle: {
          backgroundColor: "#FFD4CA",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
        },
      }}
    >
      {/* Premier onglet : Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      {/* Deuxième onglet : New (formulaire de note) */}
      <Tabs.Screen
        name="noteForm"
        options={{
          title: "New",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="New" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
