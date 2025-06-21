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

const NoteForm = () => {
  const submitting = useRef(false);
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [necessity, setNecessity] = useState("Normal");
  const [idn, setIdn] = useState(null);
  const [date] = useState(new Date());

  useEffect(() => {
    if (params?.title) setTitle(params.title);
    if (params?.content) setContent(params.content);
    if (params?.necessity) setNecessity(params.necessity);
    if (params?.idn) setIdn(params.idn);
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
    submitting.current = true;
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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setNecessity("Normal");

    setIdn(null);
  };

  const restoreForm = () => {
    setTitle(title);
    setContent(content);
    setNecessity(necessity);
  };

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

        <View className="px-4">
          <Text className="font-bold mb-1">Title</Text>
          <TextInput
            className="border border-gray-400 rounded p-2 mb-4"
            value={title}
            onChangeText={setTitle}
            placeholder="Fill the title"
            placeholderTextColor="gray"
          />

          <Text className="font-bold mb-1">Content</Text>
          <TextInput
            className="border border-gray-400 rounded p-5 mb-4 h-32"
            value={content}
            onChangeText={setContent}
            placeholder="Fill the content..."
            placeholderTextColor="gray"
            multiline
            numberOfLines={10}
          />

          <Text className="font-bold mb-1 mt-2">Necessity</Text>
          <Picker
            selectedValue={necessity}
            onValueChange={setNecessity}
            itemStyle={{ color: "black" }}
          >
            <Picker.Item label="Normal" value="Normal" color="black" />
            <Picker.Item label="Important" value="Important" />
            <Picker.Item label="Reminder" value="Reminder" />
          </Picker>

          <View className="mt-4">
            {submitting.current ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-blue-500  py-3 px-6 mt-4 self-center active:opacity-80 rounded-full"
                accessibilityLabel="Save note"
                accessibilityRole="button"
              >
                <Text className="text-white font-bold text-lg text-center">
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
