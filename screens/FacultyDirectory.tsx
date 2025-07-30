import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, Modal, ScrollView, Animated } from "react-native";
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
import Loading from "../components/Loading";

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
  
  // Animation values for staggered fade-in
  const [fadeAnimations] = useState<{ [key: string]: Animated.Value }>({});
  
  // Search focus animation
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchScale] = useState(new Animated.Value(1));



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

  // Initialize animations for list items
  useEffect(() => {
    if (filteredList.length > 0) {
      filteredList.forEach((item, index) => {
        const key = 'id' in item ? String(item.id) : item.name;
        if (!fadeAnimations[key]) {
          fadeAnimations[key] = new Animated.Value(0);
        }
        
        // Staggered animation with 100ms delay between items
        Animated.timing(fadeAnimations[key], {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [filteredList]);

  // Handle search focus/blur animations
  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.timing(searchScale, {
      toValue: 1.02,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.timing(searchScale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

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
    const key = 'id' in item ? String(item.id) : item.name;
    const fadeAnim = fadeAnimations[key] || new Animated.Value(1);

    if (item.type === 'header') {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>{item.name}</Text>
        </Animated.View>
      );
    }
    
    if (item.type === 'contact') {
      return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}] }}>
          <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8}>
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
        </Animated.View>
      );
    }
    
    // Department/division logo circle
    if (item.type === 'department' || item.type === 'division') {
      return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}] }}>
          <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8}>
            <View style={[styles.item, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
              <View style={styles.logoContainerWhiteFixed}> 
                <Text style={styles.logoTextRedFixed}>{logos[item.name]}</Text> 
              </View>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Background Image for Dark Theme */}
      {theme.backgroundImage && (
        <Image 
          source={theme.backgroundImage} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      
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
            <Text style={[styles.title, { color: theme.textPrimary }]}>Faculty Directory</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Find faculty members</Text>
          </View>

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
        <Animated.View 
          style={[
            styles.searchContainer, 
            { 
              backgroundColor: theme.surfaceColor, 
              shadowColor: theme.shadowColor,
              transform: [{ scale: searchScale }],
              borderWidth: searchFocused ? 2 : 1,
              borderColor: searchFocused ? theme.accentPrimary : theme.borderColor,
            }
          ]}
        >
          <View style={styles.searchBox}>
            <Icon 
              name="search" 
              size={20} 
              color={searchFocused ? theme.accentPrimary : theme.textSecondary} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search by department or name"
              placeholderTextColor={theme.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => setSearchQuery("")} 
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Icon name="times-circle" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      {loading ? (
        <Loading 
          message="Loading faculty data..." 
          size="large" 
          variant="spinner" 
        />
      ) : (
        <Animated.View style={{ flex: 1, opacity: searchQuery ? 1 : 1 }}>
          <FlatList
            data={filteredList}
            keyExtractor={(item: any) => 'id' in item ? item.id.toString() : item.name}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            // Removed refreshControl for pull-to-refresh
          />
        </Animated.View>
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
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
    borderRadius: 28, // Pill-style rounded corners
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 16,
    minHeight: 56, // Larger touch target
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    minHeight: 56, // Ensure consistent height
  },
  searchIcon: {
    marginRight: 16,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#2c2c2c",
    lineHeight: 22,
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 16,
    padding: 4,
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

  listContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c2c2c",
    marginTop: 32,
    marginBottom: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f3e2c7",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e74c3c",
    lineHeight: 24,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c2c2c",
    flex: 1,
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f3e2c7",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  contactImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    marginRight: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  contactImageInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3e2c7",
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  contactText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c2c2c",
    lineHeight: 24,
    marginBottom: 4,
  },
  contactRole: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
    marginTop: 2,
    lineHeight: 20,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff", // Always white
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoTextRedFixed: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e74c3c", // Always red
    lineHeight: 24,
  },
});

export default FacultyDirectory;