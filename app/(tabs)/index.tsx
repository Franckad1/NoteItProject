import { icons } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
export default function Index() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const parsedNotes = result.map(([key, value]) => JSON.parse(value));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Erreur lors du chargement des notes :", error);
      }
    };

    fetchNotes();
  }, [notes]);

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo2}
          className="w-12 h-10 mt-20 mb-5 mx-auto rounded-full"
        />
        {notes.length > 0 ? (
          notes.map((note) => {
            return (
              <View key={note.title}>
                <Link
                  href={{
                    pathname: `../${note.title}`,
                    params: {
                      id: `${note.title}`,
                      title: `${note.title}`,
                      date: `${note.date}`,
                      content: `${note.content}`,
                      necessity: `${note.necessity}`,
                    },
                  }}
                >
                  <Text>{note.title}</Text>
                  <Text>{note.date}</Text>
                </Link>
              </View>
            );
          })
        ) : (
          <Text className="text-bold text-black">No notes available</Text>
        )}
      </ScrollView>
    </View>
  );
}
