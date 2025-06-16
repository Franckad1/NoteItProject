import { icons } from "@/constants/icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, TextInput, View } from "react-native";
import "react-toastify/dist/ReactToastify.css";
import ToastManager, { Toast } from "toastify-react-native";

const NoteForm = () => {
  const [necessity, setNecessity] = useState("normal");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState("");
  const { setItem } = useAsyncStorage(`${title}note`);
  const router = useRouter();
  const params = useLocalSearchParams();
  useEffect(() => {
    if (typeof params !== "undefined") {
      setTitle(params.title);
      setNecessity(params.necessity);
      setContent(params.content);
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const note = {
      title,
      date: date.toLocaleDateString(),
      content,
      necessity,
    };
    if (title === "") {
      Toast.error("Fill the title");
      return;
    } else if (content === "") {
      Toast.error("Fill the content");
      return;
    }
    await setItem(JSON.stringify(note));
    console.log("Note créée :", note);
    router.navigate("/(tabs)");
  };

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
          <View>
            <Text>Titre</Text>
            <TextInput
              className="border m-1"
              value={title}
              onChangeText={setTitle}
              placeholder="Entrez le titre"
              placeholderTextColor={"black"}
            />

            <Text>Contenu</Text>
            <TextInput
              className="border m-1"
              style={[{ height: 100 }]}
              value={content}
              onChangeText={setContent}
              placeholder="Écrivez votre note..."
              placeholderTextColor={"black"}
              multiline
            />

            <Picker
              selectedValue={necessity}
              onValueChange={(currentCurrency) => setNecessity(currentCurrency)}
              itemStyle={{ color: "black" }}
            >
              <Picker.Item label="Normal" value="normal" color="black" />
              <Picker.Item label="Important" value="important" />
              <Picker.Item label="Pense bête" value="pensebete" />
            </Picker>
            <Button
              title={
                typeof params !== "undefined"
                  ? "Modifier la note"
                  : "Créer la note"
              }
              onPress={handleSubmit}
            />
            <ToastManager />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NoteForm;
