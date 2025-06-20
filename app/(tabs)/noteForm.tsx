import { icons } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ToastManager, { Toast } from "toastify-react-native";

import "react-toastify/dist/ReactToastify.css";

const NoteForm = () => {
  // Refs & navigation
  const submitting = useRef(false);
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [necessity, setNecessity] = useState("normal");
  const [buttonText, setButtonText] = useState("Create a note");
  const [idn, setIdn] = useState(null);
  const [date] = useState(new Date());

  // Préremplissage si modification
  useEffect(() => {
    if (params?.title) setTitle(params.title);
    if (params?.content) setContent(params.content);
    if (params?.necessity) setNecessity(params.necessity);

    if (params?.idn) {
      setIdn(params.idn); // Mode modification
      setButtonText("Modify a note");
    }
  }, []);

  const handleSubmit = async () => {
    if (!title) {
      Toast.error("Fill the title");
      return;
    }
    if (!content) {
      Toast.error("Fill the content");
      return;
    }

    const noteId = idn || (Date.now() / 1000).toString(); // Nouveau id si création
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

  // Gestion de l'effet blur
  useEffect(() => {
    const unmodified = navigation.addListener("blur", () => {
      if (submitting.current) {
        resetForm();
        console.log("blur ignoré");
        submitting.current = false;
        return;
      }

      if (title !== "" || content !== "" || necessity !== "Normal") {
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

  // Helpers
  const resetForm = () => {
    setTitle("");
    setContent("");
    setNecessity("normal");
    setButtonText("Create a note");
    setIdn(null);
  };

  const restoreForm = () => {
    setTitle(title);
    setContent(content);
    setNecessity(necessity);
    setButtonText(params?.idn ? "Modify a note" : "Create a note");
  };

  // UI
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

        <View>
          <Text>Titre</Text>
          <TextInput
            className="border m-1"
            value={title}
            onChangeText={setTitle}
            placeholder="Fill the title"
            placeholderTextColor="black"
          />

          <Text>Contenu</Text>
          <TextInput
            className="border m-1"
            style={{ height: 100 }}
            value={content}
            onChangeText={setContent}
            placeholder="Fill the content..."
            placeholderTextColor="black"
            multiline
          />
          <Picker
            selectedValue={necessity}
            onValueChange={setNecessity}
            itemStyle={{ color: "black" }}
          >
            <Picker.Item label="Normal" value="Normal" color="black" />
            <Picker.Item label="Important" value="Important" />
            <Picker.Item label="Reminder" value="Reminder" />
          </Picker>

          <Button
            title={buttonText}
            onPress={() => {
              submitting.current = true;
              handleSubmit();
            }}
          />
        </View>

        <ToastManager />
      </ScrollView>
    </View>
  );
};

export default NoteForm;
