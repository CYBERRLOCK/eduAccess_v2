import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./contexts/UserContext";
import EnhancedBottomNavigator from "./components/EnhancedBottomNavigator";
import SplashScreen from "./screens/SplashScreen";
import LoginPage from "./screens/loginpage";
import SignupPage from "./screens/signuppage";
import FacultyDirectory from "./screens/FacultyDirectory";
import SettingsPage from "./screens/SettingsPage";
import ContactDetailsScreen from "./screens/ContactDetailsScreen";
import HallBooking from "./screens/HallBooking";
import FacultyNotice from "./screens/FacultyNotice";
import ExamDuty from "./screens/ExamDuty";

import ExamSeatingArrangement from "./screens/ExamSeatingArrangement";
import ProfileScreen from "./screens/ProfileScreen";
import AdminNoticeUpload from "./screens/AdminNoticeUpload";
import EditProfileScreen from "./screens/EditProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import NotificationScreen from "./screens/NotificationScreen";

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginPage: undefined;
  SignupPage: undefined;
  MainTabs: undefined;
  ContactDetails: { contacts: any[]; department: string };
  HallBooking: undefined;
  FacultyNotice: undefined;
  ExamDuty: undefined;
  ExamSeatingArrangement: undefined;
  ProfileScreen: undefined;
  AdminNoticeUpload: undefined;
  EditProfileScreen: undefined;
  NotificationScreen: undefined;
};

export type TabParamList = {
  Home: undefined;
  Directory: undefined;
  ExamSeating: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator Component
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <EnhancedBottomNavigator {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Directory" component={FacultyDirectory} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="ExamSeating" component={ExamSeatingArrangement} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="SplashScreen"
            screenOptions={{
              headerShown: false,
              gestureEnabled: false
            }}
          >
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
            />
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
            />
            <Stack.Screen
              name="SignupPage"
              component={SignupPage}
            />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContactDetails"
              component={ContactDetailsScreen}
            />
            <Stack.Screen
              name="HallBooking"
              component={HallBooking}
            />
            <Stack.Screen
              name="FacultyNotice"
              component={FacultyNotice}
            />
            <Stack.Screen
              name="ExamDuty"
              component={ExamDuty}
            />
            <Stack.Screen
              name="ExamSeatingArrangement"
              component={ExamSeatingArrangement}
            />
            <Stack.Screen
              name="AdminNoticeUpload"
              component={AdminNoticeUpload}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;