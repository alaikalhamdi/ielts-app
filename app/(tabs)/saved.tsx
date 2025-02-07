import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";

export default function Saved() {
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    const loadSavedWords = async () => {
      const words = await AsyncStorage.getItem("savedWords");
      if (words) setSavedWords(JSON.parse(words));
    };
    loadSavedWords();
  }, []);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }} lightColor="#D0D0D0" darkColor="#333333">
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Saved Words
      </Text>
      {savedWords.length > 0 ? (
        <FlatList
          data={savedWords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={{ fontSize: 18, marginBottom: 5 }}>• {item}</Text>
          )}
        />
      ) : (
        <Text style={{ fontSize: 18, fontStyle: "italic" }}>
          No words saved yet.
        </Text>
      )}
    </ThemedView>
  );
}
