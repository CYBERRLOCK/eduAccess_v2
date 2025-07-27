import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Modal, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import supabase from '../supabase'; // Import Supabase client
import type { Contact } from "../types"; // Ensure you have a Contact type defined in your types file
// Add at the top with other imports
import { useFocusEffect } from "@react-navigation/native";
import type { RootStackParamList } from "../App";
import PhotoViewer from './PhotoViewer';
import { useTheme } from "../components/theme-provider";

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
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();



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
        console.log(`Fetched ${data?.length || 0} contacts from ${table}:`, data);
        if (data && data.length > 0) {
          console.log('Sample contact data structure:', data[0]);
        }
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

  const filteredList = (() => {
    let filtered = combinedList;
    
    // Apply search filter
    if (searchQuery) {
      filtered = [
        ...departments
          .filter(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(dept => ({ type: 'department', name: dept })),
        ...divisions
          .filter(div => div.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(div => ({ type: 'division', name: div })),
        ...sampleContacts
          .filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.department?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(contact => ({ type: 'contact', ...contact })),
      ];
    }
    
    // Apply department filter
    if (selectedFilter) {
      filtered = filtered.filter(item => {
        if (item.type === 'contact') {
          return (item as any).department?.toLowerCase().includes(selectedFilter.toLowerCase());
        }
        return true; // Keep departments and divisions
      });
    }
    
    return filtered;
  })();

  const handlePhotoPress = (photoUrl: string, facultyName: string) => {
    setSelectedPhoto({ url: photoUrl, name: facultyName });
    setPhotoViewerVisible(true);
  };

  const closePhotoViewer = () => {
    setPhotoViewerVisible(false);
    setSelectedPhoto(null);
  };

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
      return <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>{item.name}</Text>;
    }
    if (item.type === 'contact') {
      console.log('Rendering contact item:', item);
      console.log('Avatar URL:', item.avatar);
      return (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <View style={[styles.contactItem, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
            <TouchableOpacity 
              style={styles.contactImage}
              onPress={() => {
                if (item.avatar || item.image_url) {
                  handlePhotoPress(item.avatar || item.image_url, item.name);
                }
              }}
            >
              {item.avatar || item.image_url ? (
                <Image 
                  source={{ uri: item.avatar || item.image_url }} 
                  style={styles.contactImageInner}
                  onError={(error) => console.log('Image loading error:', error)}
                />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: theme.accentTertiary }]}>
                  <Text style={[styles.placeholderText, { color: theme.textPrimary }]}>
                    {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactText, { color: theme.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.contactRole, { color: theme.textSecondary }]}>{item.role || item.designation || 'Faculty Member'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    // Department/division logo circle
    if (item.type === 'department' || item.type === 'division') {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={[styles.item, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
            <View style={styles.logoContainerWhiteFixed}> 
              <Text style={styles.logoTextRedFixed}>{logos[item.name]}</Text> 
          </View>
          <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 

          {/* Refresh Button */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor, marginRight: 8 }]}
            onPress={onRefresh}
          >
            <Icon name="refresh" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          {/* Settings Button */}
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
            onPress={() => navigation.navigate("SettingsPage")}
          >
            <Icon name="cog" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: theme.backgroundColor }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surfaceColor, shadowColor: theme.shadowColor }]}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search by department or name"
              placeholderTextColor={theme.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Icon name="times-circle" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentPrimary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading faculty data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item: any) => 'id' in item ? item.id.toString() : item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          // Removed refreshControl for pull-to-refresh
        />
      )}

      {/* Photo Viewer Modal */}
      <Modal
        visible={photoViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closePhotoViewer}
      >
        {selectedPhoto && (
          <PhotoViewer
            photoUrl={selectedPhoto.url}
            facultyName={selectedPhoto.name}
            onClose={closePhotoViewer}
          />
        )}
      </Modal>
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 1, 1, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#f8f1e4",
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#2c2c2c",
    lineHeight: 20,
  },
  clearButton: {
    marginLeft: 16,
  },
  filterContainer: {
    marginTop: 8,
  },
  filterScroll: {
    paddingHorizontal: 4,
  },
  filterChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#f3e2c7',
    borderColor: '#d4a574',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#2c2c2c',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    lineHeight: 20,
  },
  listContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c2c2c",
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 26,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
        backgroundColor: "#f3e2c7",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    lineHeight: 22,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c2c2c",
    flex: 1,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f3e2c7",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  contactImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    marginRight: 16,
    overflow: 'hidden',
  },
  contactImageInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3e2c7",
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c2c2c",
    lineHeight: 22,
  },
  contactRole: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 2,
    lineHeight: 18,
  },
  logoContainerWhite: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoTextRed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    lineHeight: 22,
  },
  logoContainerWhiteFixed: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff", // Always white
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoTextRedFixed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c", // Always red
    lineHeight: 22,
  },
});

export default FacultyDirectory;