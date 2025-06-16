import { icons } from "@/constants/icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Image, ScrollView, Text, TextInput, View } from "react-native";

const NoteForm = () => {
  const [currency, setCurrency] = useState("normal");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState("");
  const { setItem,removeItem } = useAsyncStorage(`${title}note`);
  const router = useRouter();

  const handleSubmit = async () => {
    const note = {
      title,
      date: date.toLocaleDateString(),
      content,
      currency,
    };
    console.log("Note créée :", note);
    
    await setItem(JSON.stringify(note));

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
              value={title}
              onChangeText={setTitle}
              placeholder="Entrez le titre"
            />

            <Text>Contenu</Text>
            <TextInput
              style={[{ height: 100 }]}
              value={content}
              onChangeText={setContent}
              placeholder="Écrivez votre note..."
              multiline
            />
            <Picker
              selectedValue={currency}
              onValueChange={(currentCurrency) => setCurrency(currentCurrency)}
              itemStyle={{ color: "black" }}
            >
              <Picker.Item label="Normal" value="normal" color="black" />
              <Picker.Item label="Important" value="important" />
              <Picker.Item label="Pense bête" value="pensebete" />
            </Picker>
            <Text>Date de création</Text>

            <Text>{date.toLocaleDateString()}</Text>
            <Button title="Créer la note" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NoteForm;
