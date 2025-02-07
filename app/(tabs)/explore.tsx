import { useState, useRef, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Animated, Easing, FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedView } from "@/components/ThemedView";

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export default function ExploreScreen() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [savedWords, setSavedWords] = useState<string[]>([]);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const fetchDefinition = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${word}`);
      const data = await response.json();
      if (data[0]?.meanings[0]?.definitions[0]?.definition) {
        setDefinition(data[0].meanings[0].definitions[0].definition);
        setFlipped(false);
      } else {
        setDefinition("Definition not found.");
      }
    } catch (error) {
      setDefinition("Error fetching definition.");
    }
    setLoading(false);
  };

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const saveWord = async (word: string) => {
    try {
      const existingWords = await AsyncStorage.getItem("savedWords");
      const wordsArray = existingWords ? JSON.parse(existingWords) : [];
      if (!wordsArray.includes(word)) {
        wordsArray.push(word);
        await AsyncStorage.setItem("savedWords", JSON.stringify(wordsArray));
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };
  

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a word..."
        value={word}
        onChangeText={setWord}
        onSubmitEditing={fetchDefinition}
      />

      <TouchableOpacity style={styles.button} onPress={fetchDefinition}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : definition ? (
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
            <TouchableOpacity onPress={flipCard} activeOpacity={0.8}>
              <Text style={styles.text}>{word}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
            <TouchableOpacity onPress={flipCard} activeOpacity={0.8}>
              <Text style={styles.text}>{definition}</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.saveButton} onPress={() => saveWord(word)}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  cardContainer: {
    width: "80%",
    height: 200,
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#2ecc71",
  },
  text: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  savedTitle: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  savedWord: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  savedText: {
    fontSize: 18,
    color: "#333",
  },
});
