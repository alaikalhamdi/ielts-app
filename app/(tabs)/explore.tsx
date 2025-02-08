import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/ThemedView";

export default function FlashcardScreen() {
  const [word, setWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      // Step 1: Get a random word
      const wordResponse = await fetch("https://random-word-api.herokuapp.com/word");
      const wordData = await wordResponse.json();
      const randomWord = wordData[0]; // API returns an array, so we get the first word

      // Step 2: Fetch definition from dictionary API
      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      const dictData = await dictResponse.json();

      // Step 3: Extract meaning
      if (dictData && dictData[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
        setWord(randomWord);
        setDefinition(dictData[0].meanings[0].definitions[0].definition);
      } else {
        setWord(randomWord);
        setDefinition("Definition not found.");
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error");
      setDefinition("Could not fetch word.");
    }
    setLoading(false);
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {word || "Press Next to get a word"}
      </Text>
      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
        {definition || ""}
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity 
          onPress={fetchRandomWord} 
          style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Next Word</Text>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
