import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

// Composant qui affiche les détails d'une note
const NoteDetails = () => {
  const router = useRouter(); // Pour naviguer entre les écrans
  const params = useLocalSearchParams(); // Récupère les paramètres de la note

  console.log("Note params :", params);

  const { removeItem } = useAsyncStorage(params.idn); // Prépare la fonction de suppression

  // Fonction pour gérer la suppression de la note
  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Do you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Delete cancelled"), // Annulation
        },
        {
          text: "Ok",
          style: "destructive",
          onPress: async () => {
            console.log("Note deleted :", params?.title);
            await removeItem(); // Supprime la note du stockage
            router.navigate("/(tabs)"); // Retourne à l'écran principal
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Fonction pour naviguer vers l'écran d'édition avec les données préremplies
  const handleEdit = () => {
    router.push({
      pathname: "./(tabs)/noteForm",
      params: {
        idn: `${params?.idn}`,
        title: `${params?.title}`,
        date: `${params?.date}`,
        content: `${params?.content}`,
        necessity: `${params?.necessity}`,
      },
    });
  };

  // Rendu de l'écran
  return (
    <View className="font-sans flex-1 p-4 bg-secondary">
      {/* Titre et date affichés en haut */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text className="font-bold mr-1">Title:</Text>
          <Text className="bg-white rounded px-1 py-1">{params?.title}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="font-bold mr-1">Date:</Text>
          <Text>{params?.date}</Text>
        </View>
      </View>

      {/* Bloc qui affiche le contenu de la note */}
      <View className="bg-white rounded-lg p-4 mb-4 h-48 justify-center items-center">
        <Text className="text-black">{params?.content}</Text>
      </View>

      {/* Affichage de l'importance de la note */}
      <Text className="mb-4">
        <Text className="font-bold">Importance: </Text>
        <Text
          className={
            params?.necessity === "Important"
              ? "text-red-500 font-bold"
              : params?.necessity === "Reminder"
                ? "text-yellow-500"
                : "text-black"
          }
        >
          {params?.necessity}
        </Text>
      </Text>

      {/* Boutons pour éditer ou supprimer la note */}
      <View className="flex-row justify-around mt-4">
        <TouchableOpacity
          onPress={handleEdit}
          className="bg-primary rounded-md px-6 py-2 active:opacity-80"
          accessibilityLabel="Edit note"
          accessibilityRole="button"
        >
          <Text className="text-black font-bold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="rounded px-6 py-2 active:opacity-80"
          accessibilityLabel="Delete note"
          accessibilityRole="button"
        >
          <Text className="text-textSecondary font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteDetails;
