import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function FlashcardScreen() {
  const [word, setWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [partOfSpeech, setPartOfSpeech] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      async function getRandomWord() {
        const wordResponse = await fetch("https://random-word-api.herokuapp.com/word");
        const wordData = await wordResponse.json();
        const randomWord = wordData[0];

        return { randomWord };
      }
      async function getWordDefinition(word: string) {
        const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const dictData = await dictResponse.json();

        return { dictData };
      }
      const { randomWord } = await getRandomWord();
      const { dictData } = await getWordDefinition(randomWord);

      // Step 3: Extract meaning
      if (dictData && dictData[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
        setWord(randomWord);
        setDefinition(dictData[0].meanings[0].definitions[0].definition);
        setPartOfSpeech("(" + dictData[0].meanings[0].partOfSpeech + ")");
      } else {
        console.log("No definition found for word:", randomWord);
        fetchRandomWord();
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error");
      setDefinition("Could not fetch word.");
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={{ padding: 20, borderRadius: 8, marginBottom: 20 }} lightColor="#D0D0D0" darkColor="#222222">
        <ThemedText style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
          {word || "Press Next to get a word"}
        </ThemedText>
        <ThemedText style={{ fontSize: 18, textAlign: "center", marginBottom: 20}}>
          {partOfSpeech || ""} {definition || ""}
        </ThemedText>
      </ThemedView>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity 
          onPress={fetchRandomWord} 
          style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 8 }}
        >
          <ThemedText style={{ color: "white", fontSize: 18 }}>Next Word</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "InstrumentSans-Italic",
  },
  instrumentSans: {
    fontFamily: "InstrumentSans",
  },
});