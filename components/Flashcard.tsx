import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedTouchableOpacity } from "@/components/ThemedTouchableOpacity";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <ThemedTouchableOpacity style={styles.card} lightColor="#D0D0D0" darkColor="#222222" onPress={() => setFlipped(!flipped)}>
      <ThemedText style={styles.text} lightColor="#D0D0D0" darkColor="#3498db">{flipped ? answer : question}</ThemedText>
    </ThemedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});
