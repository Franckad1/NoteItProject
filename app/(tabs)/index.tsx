import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const clearAll = async () => {
    Alert.alert(
      "Confirmation",
      "Supprimer toutes les notes ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui, supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              AsyncStorage.multiRemove(keys);
              setNotes([]);
              console.log(notes);
            } catch (error) {
              console.error("Erreur lors du chargement des notes :", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const parsedNotes = result
          .map(([key, value]) => (value ? JSON.parse(value) : null))
          .filter((note) => note !== null);
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Erreur lors du chargement des notes :", error);
      }
    };

    fetchNotes();
  }, [notes]);
  function getNecessityOrder(necessity: string) {
    switch (necessity) {
      case "Important":
        return 0;
      case "normal":
        return 1;
      case "Reminder":
        return 2;
      default:
        return 3;
    }
  }

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
          <>
            {/* Bouton unique en haut */}
            <TouchableOpacity onPress={clearAll} className="mb-4 self-end mr-4">
              <Text className="text-red-500 font-bold">Clear All</Text>
            </TouchableOpacity>

            {notes
              .filter((note) => note !== null)
              .sort(
                (a, b) =>
                  getNecessityOrder(a.necessity) -
                  getNecessityOrder(b.necessity)
              )
              .map((note) => (
                <View key={note.idn}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: `../${note.title}`,
                        params: {
                          idn: `${note.idn}`,
                          title: `${note.title}`,
                          date: `${note.date}`,
                          content: `${note.content}`,
                          necessity: `${note.necessity}`,
                        },
                      });
                    }}
                    className="bg-gray-100 p-3 rounded-lg mb-3"
                  >
                    <Text className="font-bold text-black">{note.title}</Text>
                    <Text className="text-sm text-gray-600">{note.date}</Text>
                    <Text className="text-xs text-gray-500 italic">
                      {note.necessity}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Image
              source={images.NoNotes}
              className="w-24 h-20 mt-40 mb- mx-auto rounded-full"
            />
            <Text className="text-3xl text-primary font-bold">
              No notes available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
