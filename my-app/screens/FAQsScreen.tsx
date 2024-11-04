import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const FAQs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Storm It?",
      answer:
        "Storm It is a simple app that allows you to add or collect your ideas/thoughts and share them as a Tweetstorm on Twitter.",
    },
    {
      question: "What is a Tweetstorm?",
      answer: "A Tweetstorm is a series of connected tweets from one person.",
    },
    {
      question: "Will my tweetstorms be saved in the app?",
      answer: "Yes, your tweetstorms will be saved unless you delete them.",
    },
    {
      question: "How do you change the tweetstorm styling in the app?",
      answer:
        "You can customize the styling in the settings section of the app.",
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search using keywords"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqContainer}>
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.questionContainer}
            >
              <Text style={styles.question}>{faq.question}</Text>
              <Icon
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#00796B"
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  faqContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00796B",
  },
  answer: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});

export default FAQs;
