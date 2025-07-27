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
  const [userType, setUserType] = useState<'faculty' | 'admin'>('faculty');

  // Admin email addresses
  const adminEmails = [
    "jayakrishans2026@cy.sjcetpalai.ac.in",
    "jominjjoseph2026@cy.sjcetpalai.ac.in"
  ];

  // Auto-detect user type when email changes
  const handleEmailChange = (text: string) => {
    setEmail(text);
    const isAdminEmail = adminEmails.includes(text.toLowerCase());
    if (isAdminEmail) {
      setUserType('admin');
    } else {
      setUserType('faculty');
    }
  };

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

    // Check if the email has admin privileges
    
    const isAdminEmail = adminEmails.includes(email.toLowerCase());
    
    // Validate user type selection
    if (isAdminEmail && userType !== 'admin') {
      Alert.alert("Error", "This email has admin privileges. Please select 'Admin' user type.");
      return;
    }
    
    if (!isAdminEmail && userType === 'admin') {
      Alert.alert("Error", "This email does not have admin privileges. Please select 'Faculty' user type.");
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
        // Store user type for use in other screens
        const userInfo = {
          email: email,
          userType: userType,
          isAdmin: isAdminEmail
        };
        
        // You can store this in AsyncStorage or pass it to other screens
        console.log("User login info:", userInfo);
        
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
      
      {/* User Type Selection */}
      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeLabel}>Select User Type:</Text>
        <View style={styles.userTypeButtons}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'faculty' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('faculty')}
          >
            <Text style={[
              styles.userTypeButtonText,
              userType === 'faculty' && styles.userTypeButtonTextActive
            ]}>
              Faculty
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'admin' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('admin')}
          >
            <Text style={[
              styles.userTypeButtonText,
              userType === 'admin' && styles.userTypeButtonTextActive
            ]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={handleEmailChange}
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
  userTypeContainer: {
    width: "100%",
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  userTypeButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007bff",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userTypeButtonActive: {
    backgroundColor: "#007bff",
  },
  userTypeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
  },
  userTypeButtonTextActive: {
    color: "#fff",
  },
});

export default LoginPage;