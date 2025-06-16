import { icons } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
export default function Index() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        console.log("result : " + result);
        const parsedNotes = result.map(([key, value]) => JSON.parse(value));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Erreur lors du chargement des notes :", error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <View>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo2}
          className="w-12 h-10 mt-20 mb-5 mx-auto rounded-full"
        />
        <View className="flex-1 mt-5"></View>
        {notes.map((note) => {
          return (
            <View key={note.title}>
              <Text>{note.title}</Text>
              <Text>{note.date}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
