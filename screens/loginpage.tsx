// Polyfill for structuredClone (for React Native)
if (typeof global.structuredClone !== "function") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Pressable
} from "react-native";
import supabase from "../supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../App";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "LoginPage">;

const LoginPage: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email.endsWith("@sjcetpalai.ac.in") && !email.endsWith("@cy.sjcetpalai.ac.in")) {
      Alert.alert("Error", "Only @sjcetpalai.ac.in emails are allowed.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Supabase login response:", { data, error });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      if (data && data.session) {
        // You can use rememberMe here to store credentials if needed
        navigation.navigate("HomePage");
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (e) {
      console.log("Login error:", e);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Login with your Organization Email:</Text>
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
      {/* Remember Me Checkbox */}
      <View style={styles.rememberMeContainer}>
        <Pressable
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]} />
        </Pressable>
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("SignupPage")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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
    marginBottom: 80
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
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    marginTop: 20,
    color: "#007bff",
  },
});

export default LoginPage;