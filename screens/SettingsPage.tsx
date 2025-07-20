import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import supabase from "../supabase"; // Import Supabase client
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type  RootStackParamList  from "../App"; // Import the type for your navigation stack
import { useTheme } from "../components/theme-provider";
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.navigate("LoginPage");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Customize your experience</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
        <View style={styles.sectionHeader}>
          <Icon name="paint-brush" size={20} color={theme.textPrimary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Appearance</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
          onPress={toggleTheme}
        >
          <View style={styles.toggleContent}>
            <Icon 
              name={isDarkMode ? "moon-o" : "sun-o"} 
              size={18} 
              color={theme.textPrimary} 
            />
            <Text style={[styles.toggleText, { color: theme.textPrimary }]}>
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Text>
          </View>
          <View style={[styles.toggleIndicator, { backgroundColor: isDarkMode ? theme.accentPrimary : theme.borderColor }]}>
            <Icon 
              name={isDarkMode ? "check" : ""} 
              size={12} 
              color={isDarkMode ? theme.textPrimary : "transparent"} 
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Other Settings */}
      <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
        <View style={styles.sectionHeader}>
          <Icon name="info-circle" size={20} color={theme.textPrimary} />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Information</Text>
        </View>
        
        <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.borderColor }]} onPress={() => {}}>
          <Text style={[styles.settingText, { color: theme.textPrimary }]}>How EduAccess works</Text>
          <Icon name="chevron-right" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.borderColor }]} onPress={() => {}}>
          <Text style={[styles.settingText, { color: theme.textPrimary }]}>About Us</Text>
          <Icon name="chevron-right" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingButton]} onPress={() => {}}>
          <Text style={[styles.settingText, { color: theme.textPrimary }]}>Contact Us</Text>
          <Icon name="chevron-right" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
        <Icon name="sign-out" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
  },
  header: {
    height: 120,
    backgroundColor: "#f8f1e4",
    borderBottomWidth: 1,
    borderBottomColor: "#e8d5b5",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c2c2c",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  placeholder: {
    width: 44,
  },
  section: {
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#d9534f",
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
