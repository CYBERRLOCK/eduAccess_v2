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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import supabase from "../supabase";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../App";
import { useTheme } from "../components/theme-provider";

const SignupPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
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
            <Text style={[styles.title, { color: theme.textPrimary }]}>Register with your Organization Email:</Text>
            
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
            
            <TouchableOpacity 
              style={[styles.registerButton, { backgroundColor: '#007bff' }]}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={[styles.registerButtonText, { color: '#ffffff' }]}>Register</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate("LoginPage" as never)}>
              <Text style={[styles.link, { color: '#007bff' }]}>Already have an account? Login</Text>
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
  registerButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    color: "#007bff",
  },
});

export default SignupPage;