import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import supabase from "../supabase"; // Import Supabase client
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type  RootStackParamList  from "../App"; // Import the type for your navigation stack

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.navigate("LoginPage");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>How EduAccess works</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>

      {/* Red Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f1e4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f0e0c0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#d9534f", // Red color for logout
  },
  logoutText: {
    color: "white",
  },
});

export default SettingsPage;

// Ensure that RootStackParamList is exported
export type RootStackParamList = {
  // Define your routes here
  LoginPage: undefined;
  SettingsPage: undefined;
  // Add other routes as needed
};
