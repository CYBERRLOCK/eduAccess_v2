import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./components/theme-provider";
import LoginPage from "./screens/loginpage";
import SignupPage from "./screens/signuppage";
import FacultyDirectory from "./screens/FacultyDirectory";
import SettingsPage from "./screens/SettingsPage"; // Import SettingsPage
import NotificationScreen from "./screens/NotificationScreen"; // Import NotificationScreen
import ContactDetailsScreen from "./screens/ContactDetailsScreen"; // Import ContactDetailsScreen
import HomePage from "./screens/homepage";
import HallBooking from "./screens/HallBooking";
import FacultyNotice from "./screens/FacultyNotice";
import ExamDuty from "./screens/ExamDuty";
import LeaveRequest from "./screens/LeaveRequest";
import Alerts from "./screens/alerts"; // Import Alerts screen
// ...import other screens...

export type RootStackParamList = {
  LoginPage: undefined;
  SignupPage: undefined;
  FacultyDirectory: undefined;
  SettingsPage: undefined; // Add SettingsPage
  NotificationScreen: undefined; // Add NotificationScreen
  ContactDetails: { contacts: any[]; department: string }; // Add ContactDetailsScreen
  HomePage: undefined;
  HallBooking: undefined;
  FacultyNotice: undefined;
  ExamDuty: undefined;
  LeaveRequest: undefined;
  Alerts: undefined; // Add Alerts screen
  // ...other routes...
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="LoginPage"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false
          }}
        >
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
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FacultyDirectory"
          component={FacultyDirectory}
          options={{ 
            headerShown: false
          }}
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
        <Stack.Screen
          name="HallBooking"
          component={HallBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FacultyNotice"
          component={FacultyNotice}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExamDuty"
          component={ExamDuty}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeaveRequest"
          component={LeaveRequest}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alerts"
          component={Alerts}
          options={{ headerShown: false }}
        />
        {/* Add other screens here */}
      </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;