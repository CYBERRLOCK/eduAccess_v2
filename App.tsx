import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./screens/loginpage";
import SignupPage from "./screens/signuppage";
import FacultyDirectory from "./screens/homepage";
import SettingsPage from "./screens/SettingsPage"; // Import SettingsPage
import NotificationScreen from "./screens/NotificationScreen"; // Import NotificationScreen
import ContactDetailsScreen from "./screens/ContactDetailsScreen"; // Import ContactDetailsScreen
// ...import other screens...

export type RootStackParamList = {
  LoginPage: undefined;
  SignupPage: undefined;
  FacultyDirectory: undefined;
  SettingsPage: undefined; // Add SettingsPage
  NotificationScreen: undefined; // Add NotificationScreen
  ContactDetails: { contacts: any[]; department: string }; // Add ContactDetailsScreen
  // ...other routes...
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupPage"
          component={SignupPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FacultyDirectory"
          component={FacultyDirectory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsPage"
          component={SettingsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContactDetails"
          component={ContactDetailsScreen}
          options={{ headerShown: false }}
        />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;