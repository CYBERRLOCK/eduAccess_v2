import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Announcements: undefined;
  Alerts: undefined;
};

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={() => navigation.navigate("Announcements")}
      >
        <Image source={{ uri: 'https://i.postimg.cc/dtJNjgtC/announcement-800x667-compressed.png' }} style={styles.icon} />
        <Text style={styles.notificationText}>Announcements</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={() => navigation.navigate("Alerts")}
      >
        <Image source={{ uri: 'https://i.postimg.cc/Ghz77zH5/alerts-800x667-compressed.png' }} style={styles.icon} />
        <Text style={styles.notificationText}>University Alerts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  notificationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NotificationScreen;