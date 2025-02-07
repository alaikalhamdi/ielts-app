import { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import Flashcard from "@/components/Flashcard";
import { ThemedView } from "@/components/ThemedView";

const flashcards = [
  { question: "What is a noun?", answer: "A noun is a person, place, or thing." },
  { question: "What is a verb?", answer: "A verb is an action or state of being." },
  { question: "What is an adjective?", answer: "An adjective describes a noun." },
];

export default function IndexScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <ThemedView style={styles.container} lightColor="#D0D0D0" darkColor="#333333">
      <Flashcard 
        question={flashcards[currentIndex].question} 
        answer={flashcards[currentIndex].answer} 
      />
      <Button title="Next" onPress={nextFlashcard} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
