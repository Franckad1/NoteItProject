import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const NoteDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  console.log("Note params :", params);

  const { removeItem } = useAsyncStorage(params.idn);

  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Do you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Delete cancelled"),
        },
        {
          text: "Ok",
          style: "destructive",
          onPress: async () => {
            console.log("Note deleted :", params?.title);
            await removeItem();
            router.navigate("/(tabs)");
          },
        },
      ],
      { cancelable: true }
    );
  };

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

  return (
    <View className="flex-1 p-4  mt-12">
      <View className="flex-row justify-between items-center mb-4">
        {/* Groupe Title */}
        <View className="flex-row items-center">
          <Text className="font-bold mr-1">Title:</Text>
          <Text className="border border-gray-300 rounded px-1 py-1">
            {params?.title}
          </Text>
        </View>

        {/* Groupe Date */}
        <View className="flex-row items-center">
          <Text className="font-bold mr-1">Date:</Text>
          <Text>{params?.date}</Text>
        </View>
      </View>

      <View className="bg-gray-200 rounded-lg p-4 mb-4 h-48 justify-center items-center">
        <Text className="text-black">{params?.content}</Text>
      </View>

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

      <View className="flex-row justify-around mt-4">
        <TouchableOpacity
          onPress={handleEdit}
          className="bg-gray-300 rounded px-6 py-2 active:opacity-80"
          accessibilityLabel="Edit note"
          accessibilityRole="button"
        >
          <Text className="text-black font-bold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="bg-gray-300 rounded px-6 py-2 active:opacity-80"
          accessibilityLabel="Delete note"
          accessibilityRole="button"
        >
          <Text className="text-black font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteDetails;
