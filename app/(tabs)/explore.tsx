import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

// Function to remove Merriam-Webster's format tags
const cleanExample = (example: string): string => {
  return example.replace(/{wi}|{\/wi}|{it}|{\/it}/g, '');
};

export default function FlashcardScreen() {
  const [word, setWord] = useState<string | null>(null);
  const [definitions, setDefinitions] = useState<{ def: string, example?: string, partOfSpeech: string }[]>([]);
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
      async function getWordDefinition(word: string): Promise<{ dictData: any } | undefined> {
        const dictResponse = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=320bec1a-48ca-4b4c-8ef4-f002d53cf5fa`);
        if (dictResponse.status === 404) {
          console.log("Word not found:", word);
          fetchRandomWord();
          return undefined;
        }
        const dictData = await dictResponse.json();
        return { dictData };
      }
      const { randomWord } = await getRandomWord();
      const { dictData }: any = await getWordDefinition(randomWord);

      // Step 3: Extract meanings and examples
      if (dictData && dictData.length > 0 && dictData[0].shortdef) {
        console.log("Word found:", randomWord);
        setWord(dictData[0].meta.stems[0] || randomWord);
        const allDefinitions = dictData.flatMap((entry: any) => {
          return entry.shortdef.map((def: string, index: number) => {
            const example = entry.def[0].sseq[0][0][1].dt[1]?.[1]?.[0]?.t || null;
            return { def, example: example ? cleanExample(example) : null, partOfSpeech: entry.fl };
          });
        });
        setDefinitions(allDefinitions);
        setLoading(false);
      } else {
        console.log("No definition found for word:", randomWord);
        fetchRandomWord();
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error");
      setDefinitions([{ def: "Could not fetch word.", partOfSpeech: "" }]);
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={{ padding: 20, borderRadius: 8, marginBottom: 20 }} lightColor="#D0D0D0" darkColor="#222222">
          <ThemedText style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
            {word || "Press Next to get a word"}
          </ThemedText>
          {definitions.map((defObj, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <ThemedText style={{ fontSize: 18, textAlign: "center" }}>
                {index + 1}. {defObj.def} {defObj.partOfSpeech && `(${defObj.partOfSpeech})`}
              </ThemedText>
              {defObj.example && (
                <ThemedText style={{ fontSize: 16, textAlign: "center", fontStyle: "italic" }}>
                  {defObj.example}
                </ThemedText>
              )}
            </View>
          ))}
        </ThemedView>
      </ScrollView>
      
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
    width: "100%",
    fontFamily: "InstrumentSans-Italic",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instrumentSans: {
    fontFamily: "InstrumentSans",
  },
});