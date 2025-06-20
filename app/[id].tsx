import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Button, Text, View } from "react-native";

const NoteDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params);

  const { removeItem } = useAsyncStorage(params.idn);
  const handleDelete = async () => {
    Alert.alert("Delete Note", "Do you want to delete this note?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          console.log("Note suprimée :", params?.title);
          removeItem();
          router.navigate("/(tabs)");
        },
      },
    ]);
  };
  return (
    <View>
      <Text>
        Note details:
        {`
      title: ${params?.title}
      date: ${params?.date}
      necessity:${params?.necessity}
      content:${params?.content}
      `}
      </Text>
      <Button
        title="Edit"
        onPress={() => {
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
        }}
      />
      <Button title="Delete" onPress={handleDelete} />
    </View>
  );
};

export default NoteDetails;
