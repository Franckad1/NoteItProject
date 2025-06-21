import { icons } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import "react-toastify/dist/ReactToastify.css";
import ToastManager, { Toast } from "toastify-react-native";

// Composant du formulaire de création ou modification de note
const NoteForm = () => {
  const submitting = useRef(false); // Référence pour suivre l'état de soumission
  const router = useRouter(); // Pour la navigation
  const navigation = useNavigation();
  const params = useLocalSearchParams(); // Récupère les paramètres passés

  // États des champs du formulaire
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [necessity, setNecessity] = useState("Normal");
  const [idn, setIdn] = useState(null);
  const [date] = useState(new Date());

  // Préremplit le formulaire si des paramètres sont fournis
  useEffect(() => {
    if (params?.title) setTitle(params.title);
    if (params?.content) setContent(params.content);
    if (params?.necessity) setNecessity(params.necessity);
    if (params?.idn) setIdn(params.idn);
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    if (!title) {
      Toast.error("Fill the title");
      return;
    }
    if (!content) {
      Toast.error("Fill the content");
      return;
    }
    submitting.current = true;

    // Crée ou modifie la note
    const noteId = idn || (Date.now() / 1000).toString();
    const note = {
      idn: noteId,
      title,
      date: date.toLocaleDateString(),
      content,
      necessity,
    };

    await AsyncStorage.setItem(noteId, JSON.stringify(note));
    console.log(idn ? "Note modifiée :" : "Note créée :", note);
    router.navigate("/(tabs)");
  };

  // Gère la détection des changements non sauvegardés
  useEffect(() => {
    const unmodified = navigation.addListener("blur", () => {
      if (submitting.current) {
        resetForm();
        submitting.current = false;
        return;
      }

      if (title || content || necessity !== "Normal") {
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure to discard them and leave the screen?",
          [
            {
              text: "Don't leave",
              style: "cancel",
              onPress: () => {
                router.navigate("/(tabs)/noteForm");
                restoreForm();
              },
            },
            {
              text: "Discard",
              style: "destructive",
              onPress: resetForm,
            },
          ]
        );
      }
    });

    return unmodified;
  }, [navigation, title, content, necessity, params, router]);

  // Réinitialise le formulaire
  const resetForm = () => {
    setTitle("");
    setContent("");
    setNecessity("Normal");
    setIdn(null);
  };

  // Restaure les valeurs actuelles du formulaire
  const restoreForm = () => {
    setTitle(title);
    setContent(content);
    setNecessity(necessity);
  };

  return (
    <View className="font-sans flex-1 bg-secondary">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%" }}
      >
        {/* Logo en haut */}
        <Image
          source={icons.logo2}
          className="w-12 h-10 mt-20 mb-5 self-center rounded-full"
        />

        <View className="px-4">
          {/* Champ titre */}
          <Text className="font-bold mb-1">Title</Text>
          <TextInput
            className="border border-gray-400 bg-white rounded p-2 mb-4"
            value={title}
            onChangeText={setTitle}
            placeholder="Fill the title"
            placeholderTextColor="gray"
          />

          {/* Champ contenu */}
          <Text className="font-bold mb-1">Content</Text>
          <TextInput
            className="border border-gray-400 bg-white rounded p-5 mb-4 h-32"
            value={content}
            onChangeText={setContent}
            placeholder="Fill the content..."
            placeholderTextColor="gray"
            multiline
            numberOfLines={10}
          />

          {/* Sélecteur importance */}
          <Text className="font-bold mb-1 mt-2">Necessity</Text>
          <Picker
            selectedValue={necessity}
            onValueChange={setNecessity}
            itemStyle={{ color: "black" }}
          >
            <Picker.Item label="Normal" value="Normal" />
            <Picker.Item label="Important" value="Important" />
            <Picker.Item label="Reminder" value="Reminder" />
          </Picker>

          {/* Bouton de soumission ou loader */}
          <View className="mt-4">
            {submitting.current ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-primary py-3 px-6 mt-4 self-center active:opacity-80 rounded-full"
                accessibilityLabel="Save note"
                accessibilityRole="button"
              >
                <Text className="text-textPrimary font-bold text-lg text-center">
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ToastManager />
      </ScrollView>
    </View>
  );
};

export default NoteForm;
