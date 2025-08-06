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
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import supabase from "../supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../App";
import { useTheme } from "../components/theme-provider";
import { useUser } from "../contexts/UserContext";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "LoginPage">;

const LoginPage: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const { setUserEmail } = useUser();
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
        // Save the user's email for profile fetching
        await setUserEmail(email);
        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (e) {
      console.log("Login error:", e);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.trim()) {
      Alert.alert("Error", "Please enter your email address first.");
      return;
    }

    if (!email.endsWith("@sjcetpalai.ac.in") && !email.endsWith("@cy.sjcetpalai.ac.in")) {
      Alert.alert("Error", "Only @sjcetpalai.ac.in emails are allowed.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'eduaccess://reset-password',
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "Password Reset Email Sent", 
        "Please check your email for password reset instructions. If you don't see it, check your spam folder.",
        [
          {
            text: "OK",
            onPress: () => console.log("Password reset email sent to:", email)
          }
        ]
      );
    } catch (e) {
      console.log("Password reset error:", e);
      Alert.alert("Error", "Failed to send password reset email. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          {/* Background Image for Dark Theme */}
          {theme.backgroundImage && (
            <Image 
              source={theme.backgroundImage} 
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          )}
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Login with your Organization Email:</Text>
            
            <TextInput
              style={[styles.input, { 
                borderColor: theme.borderColor, 
                backgroundColor: theme.surfaceColor,
                color: theme.textPrimary 
              }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="example@sjcetpalai.ac.in"
              placeholderTextColor={theme.textTertiary}
            />
            <TextInput
              style={[styles.input, { 
                borderColor: theme.borderColor, 
                backgroundColor: theme.surfaceColor,
                color: theme.textPrimary 
              }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={theme.textTertiary}
            />
            
            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: '#007bff' }]}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Remember Me Checkbox */}
            <View style={styles.rememberMeContainer}>
              <Pressable
                style={styles.checkbox}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  styles.checkboxBox, 
                  { borderColor: '#007bff' },
                  rememberMe && { backgroundColor: '#007bff' }
                ]} />
              </Pressable>
              <Text style={[styles.rememberMeText, { color: theme.textPrimary }]}>Remember Me</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: '#007bff' }]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={[styles.loginButtonText, { color: '#ffffff' }]}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate("SignupPage")}>
              <Text style={[styles.link, { color: '#007bff' }]}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    textAlign: 'center',
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
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    marginTop: 20,
    color: "#007bff",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginPage;