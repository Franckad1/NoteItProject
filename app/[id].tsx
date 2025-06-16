import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Button, Text, View } from "react-native";

const NoteDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { removeItem } = useAsyncStorage(`${params.title}note`);
  const handleDelete = async (event) => {
    event.preventDefault();
    Alert.alert("Delete Note", "Do you want to delete this note?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          console.log("Note suprimée :", params.title);
          removeItem();
          router.navigate("/(tabs)");
        },
      },
    ]);
  };
  return (
    <View>
      <Text>{`
      Note details:
      title: ${params.title}
      date: ${params.date}
      necessity:${params.necessity}
      content:${params.content}
      `}</Text>
      <Button
        title="Edit"
        onPress={() => {
          router.navigate({
            pathname: "./(tabs)/noteForm",
            params: {
              id: `${params.title}`,
              title: `${params.title}`,
              date: `${params.date}`,
              content: `${params.content}`,
              necessity: `${params.necessity}`,
            },
          });
        }}
      ></Button>
      <Button title="Delete" onPress={handleDelete}></Button>
    </View>
  );
};

export default NoteDetails;
