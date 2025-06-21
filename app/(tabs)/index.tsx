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
  const add = () => {
    router.navigate("/(tabs)/noteForm");
  };
  const clearAll = async () => {
    Alert.alert(
      "Confirmation",
      "Supprimer toutes les notes ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(keys);
              setNotes([]);
              console.log("Toutes les notes ont été supprimées");
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
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

  function getNecessityOrder(necessity) {
    switch (necessity) {
      case "Important":
        return 0;
      case "Normal":
        return 1;
      case "Reminder":
        return 2;
      default:
        return 3;
    }
  }

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%" }}
      >
        <Image
          source={icons.logo2}
          className="w-12 h-10 mt-20 mb-5 self-center rounded-full"
        />

        {notes.length > 0 ? (
          <>
            <TouchableOpacity onPress={clearAll} className="self-end mr-4 mb-4">
              <Text className="text-red-500 font-bold">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={add} className="self-start mr-4 mb-4">
              <Text className="text-blue-500 font-bold">Add</Text>
            </TouchableOpacity>
            {notes
              .sort(
                (a, b) =>
                  getNecessityOrder(a.necessity) -
                  getNecessityOrder(b.necessity)
              )
              .map((note) => (
                <TouchableOpacity
                  key={note.idn}
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
                  className="bg-gray-100 p-3 rounded-lg mb-3 mx-4"
                >
                  <Text className="font-bold text-black">{note.title}</Text>
                  <Text
                    className="text-black"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {note.content}
                  </Text>
                  <Text className="text-sm text-gray-600">{note.date}</Text>
                  <Text
                    className={
                      note.necessity === "Important"
                        ? "text-red-500 font-bold"
                        : note.necessity === "Reminder"
                          ? "text-yellow-500"
                          : "text-black"
                    }
                  >
                    {note.necessity}
                  </Text>
                </TouchableOpacity>
              ))}
          </>
        ) : (
          <View className="flex-1 justify-center items-center ">
            <Image
              source={images.NoNotes}
              className="w-24 h-20 rounded-full mb-4"
            />

            <Text className="text-3xl text-primary font-bold">
              No notes available
            </Text>
            <TouchableOpacity onPress={add} className="mt-2 mr-4 mb-4">
              <Text className="text-blue-500 text-3xl font-bold">Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
