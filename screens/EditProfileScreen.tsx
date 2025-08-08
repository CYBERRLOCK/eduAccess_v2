import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';
import { useUser } from '../contexts/UserContext';
import { fetchUserProfileByEmail, updateUserProfile, type UserProfile } from '../api/profileApi';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfileScreen'>;

interface EditProfileForm {
  employee_id: string;
  office_location: string;
  joining_date: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { userEmail } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState<EditProfileForm>({
    employee_id: '',
    office_location: '',
    joining_date: '',
  });

  useEffect(() => {
    if (userEmail) {
      loadUserProfile();
    }
  }, [userEmail]);

  const loadUserProfile = async () => {
    if (!userEmail) return;
    
    setIsLoading(true);
    try {
      const profile = await fetchUserProfileByEmail(userEmail);
      setUserProfile(profile);
      
      // Pre-fill form with existing data
      if (profile) {
        setFormData({
          employee_id: profile.employee_id || '',
          office_location: profile.office_location || '',
          joining_date: profile.joining_date || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'User email not found. Please login again.');
      return;
    }

    // Basic validation
    if (!formData.employee_id.trim()) {
      Alert.alert('Validation Error', 'Please enter your Employee ID.');
      return;
    }

    if (!formData.office_location.trim()) {
      Alert.alert('Validation Error', 'Please enter your Office Location.');
      return;
    }

    if (!formData.joining_date.trim()) {
      Alert.alert('Validation Error', 'Please enter your Joining Date.');
      return;
    }

    setIsSaving(true);
    try {
      console.log('💾 Saving profile updates...');
      console.log('📝 Form data:', formData);
      
      const success = await updateUserProfile(userEmail, {
        employee_id: formData.employee_id.trim(),
        office_location: formData.office_location.trim(),
        joining_date: formData.joining_date.trim(),
      });

      if (success) {
        console.log('✅ Profile updated successfully');
        Alert.alert(
          'Success',
          'Profile updated successfully! Your information has been saved to the database.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        console.error('❌ Failed to update profile');
        Alert.alert('Error', 'Failed to update profile. Please check your connection and try again.');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundColor} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentPrimary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundColor} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}
            onPress={handleCancel}
          >
            <Icon name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Edit Profile</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Update your information</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* User Info Display */}
        <View style={[styles.userInfoCard, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}>
          <Text style={[styles.userInfoTitle, { color: theme.textPrimary }]}>Current Profile</Text>
          <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
            Name: {userProfile?.name || 'Not Available'}
          </Text>
          <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
            Email: {userEmail || 'Not Available'}
          </Text>
          <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
            Department: {userProfile?.department || 'Not Available'}
          </Text>
          {userProfile?.employee_id && (
            <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
              Employee ID: {userProfile.employee_id}
            </Text>
          )}
          {userProfile?.office_location && (
            <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
              Office Location: {userProfile.office_location}
            </Text>
          )}
          {userProfile?.joining_date && (
            <Text style={[styles.userInfoText, { color: theme.textSecondary }]}>
              Joining Date: {userProfile.joining_date}
            </Text>
          )}
        </View>

        {/* Employee ID Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Employee ID *</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.surfaceColor, 
              color: theme.textPrimary,
              borderColor: theme.borderLight 
            }]}
            placeholder="Enter your employee ID (e.g., EMP001, F2023001)"
            placeholderTextColor={theme.textTertiary}
            value={formData.employee_id}
            onChangeText={(text) => setFormData({ ...formData, employee_id: text })}
            autoCapitalize="characters"
            maxLength={20}
          />
          <Text style={[styles.hintText, { color: theme.textTertiary }]}>
            This will be saved to your faculty record in the database
          </Text>
        </View>

        {/* Office Location Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Office Location *</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.surfaceColor, 
              color: theme.textPrimary,
              borderColor: theme.borderLight 
            }]}
            placeholder="Enter your office location (e.g., Room 205, Block A)"
            placeholderTextColor={theme.textTertiary}
            value={formData.office_location}
            onChangeText={(text) => setFormData({ ...formData, office_location: text })}
            autoCapitalize="words"
            maxLength={100}
          />
          <Text style={[styles.hintText, { color: theme.textTertiary }]}>
            This will be saved to your faculty record in the database
          </Text>
        </View>

        {/* Joining Date Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Joining Date *</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.surfaceColor, 
              color: theme.textPrimary,
              borderColor: theme.borderLight 
            }]}
            placeholder="Enter your joining date (e.g., 15 March 2020)"
            placeholderTextColor={theme.textTertiary}
            value={formData.joining_date}
            onChangeText={(text) => setFormData({ ...formData, joining_date: text })}
            autoCapitalize="words"
            maxLength={50}
          />
          <Text style={[styles.hintText, { color: theme.textTertiary }]}>
            This will be saved to your faculty record in the database
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { 
                backgroundColor: theme.surfaceColor,
                borderColor: theme.borderLight
              }
            ]}
            onPress={handleCancel}
            disabled={isSaving}
          >
            <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              { 
                backgroundColor: isSaving ? theme.textTertiary : theme.accentSecondary,
                opacity: isSaving ? 0.7 : 1
              }
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 120,
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    lineHeight: 20,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  userInfoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 