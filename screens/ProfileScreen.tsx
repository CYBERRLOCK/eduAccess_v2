import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';
import { BackHandler } from 'react-native';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  items: ProfileItem[];
}

interface ProfileItem {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'phone' | 'link';
  action?: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const [slideAnim] = useState(new Animated.Value(50));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Slide-in animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const profileData = {
    name: 'Dr. John Doe',
    email: 'john.doe@sjcetpalai.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    employeeId: 'CS001',
    phone: '+91 98765 43210',
    office: 'Room 205, Block A',
    joiningDate: '15 March 2020',
  };

  const profileSections: ProfileSection[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'user',
      items: [
        { id: 'name', label: 'Full Name', value: profileData.name, type: 'text' },
        { id: 'email', label: 'Email', value: profileData.email, type: 'email' },
        { id: 'phone', label: 'Phone', value: profileData.phone, type: 'phone' },
      ],
    },
    {
      id: 'academic',
      title: 'Academic Details',
      icon: 'graduation-cap',
      items: [
        { id: 'department', label: 'Department', value: profileData.department, type: 'text' },
        { id: 'designation', label: 'Designation', value: profileData.designation, type: 'text' },
        { id: 'employeeId', label: 'Employee ID', value: profileData.employeeId, type: 'text' },
      ],
    },
    {
      id: 'work',
      title: 'Work Information',
      icon: 'building',
      items: [
        { id: 'office', label: 'Office Location', value: profileData.office, type: 'text' },
        { id: 'joiningDate', label: 'Joining Date', value: profileData.joiningDate, type: 'text' },
      ],
    },
  ];

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => navigation.navigate('LoginPage')
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <Animated.View
      style={[
        styles.profileHeader,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Icon name="camera" size={16} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.profileName, { color: theme.textPrimary }]}>
        {profileData.name}
      </Text>
      <Text style={[styles.profileDesignation, { color: theme.textSecondary }]}>
        {profileData.designation}
      </Text>
      <Text style={[styles.profileDepartment, { color: theme.textTertiary }]}>
        {profileData.department}
      </Text>
    </Animated.View>
  );

  const renderSection = (section: ProfileSection, index: number) => (
    <Animated.View
      key={section.id}
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.accentPrimary + '20' }]}>
          <Icon name={section.icon} size={20} color={theme.accentPrimary} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          {section.title}
        </Text>
      </View>
      
      <View style={[styles.sectionContent, { backgroundColor: theme.surfaceColor }]}>
        {section.items.map((item, itemIndex) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>
              {item.label}
            </Text>
            <Text style={[styles.itemValue, { color: theme.textPrimary }]}>
              {item.value}
            </Text>
            {itemIndex < section.items.length - 1 && (
              <View style={[styles.itemDivider, { backgroundColor: theme.borderLight }]} />
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderActionButtons = () => (
    <Animated.View
      style={[
        styles.actionButtons,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.accentPrimary }]}
        onPress={handleEditProfile}
        activeOpacity={0.8}
      >
        <Icon name="edit" size={18} color={theme.textPrimary} />
        <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>
          Edit Profile
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Icon name="sign-out" size={18} color={theme.error} />
        <Text style={[styles.actionButtonText, { color: theme.error }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

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
      
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundColor} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Profile</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your account details</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        
        {profileSections.map((section, index) => renderSection(section, index))}
        
        {renderActionButtons()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileDesignation: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileDepartment: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionContent: {
    borderRadius: 16,
    padding: 20,
  },
  itemContainer: {
    marginBottom: 16,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDivider: {
    height: 1,
    marginTop: 16,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 