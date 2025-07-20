import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image, BackHandler } from "react-native";
import supabase from "../supabase";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types";

const SignupPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const handleSignup = async () => {
    if (!email.endsWith("@sjcetpalai.ac.in") && !email.endsWith("@cy.sjcetpalai.ac.in")) {
      Alert.alert("Error", "Only @sjcetpalai.ac.in emails are allowed.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Signup successful! Please check your email for confirmation.");
      navigation.navigate("LoginPage" as never);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Register with your Organization Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="example@sjcetpalai.ac.in"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />
      <Button title="Register" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate("LoginPage" as never)}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f1e4",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  link: {
    marginTop: 20,
    color: "#007bff",
  },
});

export default SignupPage;