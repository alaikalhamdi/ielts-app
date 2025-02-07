import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={() => setFlipped(!flipped)}>
      <Text style={styles.text}>{flipped ? answer : question}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});
