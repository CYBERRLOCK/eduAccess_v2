import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import supabase from '../supabase'; // Import Supabase client
import type { Contact } from "../types"; // Ensure you have a Contact type defined in your types file
// Add at the top with other imports
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

type RootStackParamList = {
  ContactDetails: { contacts: Contact[], department: string };
  SettingsPage: undefined; // Add SettingsPage to the RootStackParamList
  NotificationScreen: undefined; // Add NotificationScreen to the RootStackParamList
};

const CACHE_KEY_CONTACTS = 'faculty_contacts_cache';
const CACHE_EXPIRY_KEY_CONTACTS = 'faculty_contacts_cache_expiry';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const departments = [
  "Artificial Intelligence & Data Science",
  "Civil Engineering",
  "Computer Science & Engineering",
  "Computer Science & Engineering (Cyber Security)",
  "Computer Science & Engineering (Artificial Intelligence)",
  "Electronics & Communication Engineering",
  "Electronics & Computer Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Computer Applications",
  "Masters in Business Administration",
  "Science & Humanities Department",
];

const divisions = [
  "Research",
  "Office & Administration",
  "Library & Information",
  "Physical Education",
  "Placements",
  "Software Development Center",
];

const logos: { [key: string]: string } = {
  "Artificial Intelligence & Data Science": "ad",
  "Civil Engineering": "ce",
  "Computer Science & Engineering": "cse",
  "Computer Science & Engineering (Cyber Security)": "cy",
  "Computer Science & Engineering (Artificial Intelligence)": "ai",
  "Electronics & Communication Engineering": "ece",
  "Electronics & Computer Engineering": "es",
  "Electrical & Electronics Engineering": "eee",
  "Mechanical Engineering": "me",
  "Computer Applications": "mca",
  "Masters in Business Administration": "mba",
  "Science & Humanities Department": "s&h",
  "Research": "R",
  "Office & Administration": "o&a",
  "Library & Information": "Li",
  "Physical Education": "pe",
  "Placements": "pl",
  "Software Development Center": "sdc",
};

const FacultyDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sampleContacts, setSampleContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const cachedContacts = await AsyncStorage.getItem(CACHE_KEY_CONTACTS);
    const cacheExpiryContacts = await AsyncStorage.getItem(CACHE_EXPIRY_KEY_CONTACTS);
    const isCacheValidContacts = cacheExpiryContacts && new Date().getTime() < parseInt(cacheExpiryContacts);

    if (cachedContacts && isCacheValidContacts) {
      setSampleContacts(JSON.parse(cachedContacts));
    } else {
      fetchContacts();
    }

    setLoading(false);
  };

  const fetchContacts = async () => {
    const tables = [
      'ad', 'ce', 'cse', 'csecy', 'cseai', 'ece', 'es', 'eee', 'me', 'mca', 'mba', 's&h', 'research', 'o&a', 'library', 'pe', 'placements', 'sdc'
    ];
    const allContacts: Contact[] = [];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
      } else {
        allContacts.push(...data);
      }
    }

    setSampleContacts(allContacts);
    await AsyncStorage.setItem(CACHE_KEY_CONTACTS, JSON.stringify(allContacts));
    await AsyncStorage.setItem(CACHE_EXPIRY_KEY_CONTACTS, (new Date().getTime() + CACHE_EXPIRY_TIME).toString());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await AsyncStorage.removeItem(CACHE_KEY_CONTACTS);
      await AsyncStorage.removeItem(CACHE_EXPIRY_KEY_CONTACTS);
      await fetchContacts();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
    setRefreshing(false);
  };

  const combinedList = [
    { type: 'header', name: 'Departments' },
    ...departments.map(dept => ({ type: 'department', name: dept })),
    { type: 'header', name: 'Division' },
    ...divisions.map(div => ({ type: 'division', name: div })),
  ];

  const filteredList = searchQuery
    ? [
        ...departments
          .filter(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(dept => ({ type: 'department', name: dept })),
        ...divisions
          .filter(div => div.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(div => ({ type: 'division', name: div })),
        ...sampleContacts
          .filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(contact => ({ type: 'contact', ...contact })),
      ]
    : combinedList;

  const handlePress = async (item: any) => {
    let tableName = '';
    switch (item.name) {
      case 'Artificial Intelligence & Data Science':
        tableName = 'ad';
        break;
      case 'Civil Engineering':
        tableName = 'ce';
        break;
      case 'Computer Science & Engineering':
        tableName = 'cse';
        break;
      case 'Computer Science & Engineering (Cyber Security)':
        tableName = 'csecy';
        break;
      case 'Computer Science & Engineering (Artificial Intelligence)':
        tableName = 'cseai';
        break;
      case 'Electronics & Communication Engineering':
        tableName = 'ece';
        break;
      case 'Electronics & Computer Engineering':
        tableName = 'es';
        break;
      case 'Electrical & Electronics Engineering':
        tableName = 'eee';
        break;
      case 'Mechanical Engineering':
        tableName = 'me';
        break;
      case 'Computer Applications':
        tableName = 'mca';
        break;
      case 'Masters in Business Administration':
        tableName = 'mba';
        break;
      case 'Science & Humanities Department':
        tableName = 's&h';
        break;
      case 'Research':
        tableName = 'research';
        break;
      case 'Office & Administration':
        tableName = 'o&a';
        break;
      case 'Library & Information':
        tableName = 'library';
        break;
      case 'Physical Education':
        tableName = 'pe';
        break;
      case 'Placements':
        tableName = 'placements';
        break;
      case 'Software Development Center':
        tableName = 'sdc';
        break;
      default:
        break;
    }

    if (tableName) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        navigation.navigate("ContactDetails", { contacts: data, department: item.name });
      }
    } else if (item.type === 'department' || item.type === 'division') {
      const contacts = sampleContacts.filter(contact => contact.department === item.name);
      navigation.navigate("ContactDetails", { contacts, department: item.name });
    } else if (item.type === 'contact') {
      navigation.navigate("ContactDetails", { contacts: [item], department: item.department });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.name}</Text>;
    }
    if (item.type === 'contact') {
      return (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <View style={styles.contactItem}>
            <Image source={{ uri: item.image_url }} style={styles.contactImage} />
            <Text style={styles.contactText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.item}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>{logos[item.name]}</Text>
          </View>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <Image source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }} style={styles.logo} />
          <Text style={styles.title}>EduAccess</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
              <Icon name="bell" size={24} color="#000" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SettingsPage")}>
              <Icon name="cog" size={24} color="#000" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search departments, contacts, or announcements..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearIcon}>
              <Icon name="times-circle" size={20} color="#000" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.mainTitle}>Home</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item: any) => 'id' in item ? item.id.toString() : item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
  },
  fixedHeader: {
    backgroundColor: "#f8f1e4",
    paddingVertical: 40, // Increased padding for more space
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f1e4",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between elements
    marginBottom: 10, // Adjusted margin for more space
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "justify",
    flex: 1, // Center the title
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 1,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  clearIcon: {
    marginLeft: 10,
  },
  scrollContainer: {
    padding: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f3e2c7", // Change background color
    borderRadius: 8, // Add border radius for rounded corners
    marginBottom: 10, // Add margin bottom for spacing between items
    flex: 1, // Ensure the item takes up available space
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red", // Change text color to red
  },
  itemText: {
    fontSize: 16,
    color: "#000",
    flex: 1, // Allow the text to take up available space
    flexWrap: 'wrap', // Allow text to wrap if necessary
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f3e2c7",
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginRight: 15,
  },
  contactText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default FacultyDirectory;