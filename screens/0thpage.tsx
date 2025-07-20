import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Ensure that RootStackParamList is exported from this file
export type RootStackParamList = {
  SplashScreen: undefined;
  LoginPage: undefined;
  // Add other routes here
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "SplashScreen">;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("LoginPage");
    }, 2000); // Navigate to LoginPage after 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }} // Replace with your image URL
        style={styles.logo}
      />
      <Text style={styles.text}>EduAccess</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f1e4",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
  },
});

export default SplashScreen;