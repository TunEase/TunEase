import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Header from "../components/staticBusinessProfile/Header";
import MainImage from "../components/staticBusinessProfile/MainImage";
import ServicesSection from "../components/staticBusinessProfile/ServicesSection";
// import Footer from "../components/staticBusinessProfile/Footer";

const CompanyPage: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Header />
      <MainImage />
      <ServicesSection />
      {/* <Footer /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

export default CompanyPage;
