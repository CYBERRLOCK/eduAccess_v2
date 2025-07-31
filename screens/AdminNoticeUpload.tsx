import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';
import { createFacultyNotice, uploadNoticePDF, verifyStorageSetup, generateNoticeSummary, type FacultyNotice } from '../api/noticesApi';

type AdminNoticeUploadNavigationProp = StackNavigationProp<RootStackParamList, 'AdminNoticeUpload'>;

const AdminNoticeUpload = () => {
  const navigation = useNavigation<AdminNoticeUploadNavigationProp>();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<{ uri: string; name: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    posted_by: 'Admin' // This would come from user authentication
  });

  const categories = ['Meeting', 'Academic', 'Research', 'Resources', 'System', 'General'];
  const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedPDF(asset.uri);
        setPdfFile({ uri: asset.uri, name: asset.name });
      }
    } catch (error) {
      console.error('Error picking PDF:', error);
      Alert.alert('Error', 'Failed to pick PDF. Please try again.');
    }
  };

  const removePDF = () => {
    setSelectedPDF(null);
    setPdfFile(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      let pdfUrl = undefined;

      // Upload PDF if selected
      if (pdfFile) {
        try {
          console.log('Starting PDF upload...');
          
          // Verify storage setup first
          const isStorageReady = await verifyStorageSetup();
          if (!isStorageReady) {
            throw new Error('Storage bucket not properly configured');
          }
          
          const fileName = pdfFile.name || `notice_${Date.now()}.pdf`;
          pdfUrl = await uploadNoticePDF(pdfFile.uri, fileName);
          console.log('PDF upload successful, URL:', pdfUrl);
        } catch (error) {
          console.error('PDF upload failed:', error);
          Alert.alert(
            'PDF Upload Failed', 
            'The notice will be created without the PDF. Please check your Supabase storage configuration.',
            [{ text: 'Continue' }]
          );
          pdfUrl = undefined;
        }
      }

      // Create notice
      const noticeData = {
        ...formData,
        content: '', // Default empty content since we removed the content input
        pdf_url: pdfUrl,
      };

      const createdNotice = await createFacultyNotice(noticeData);

      // Generate AI summary if PDF was uploaded
      if (pdfUrl && createdNotice) {
        try {
          setIsGeneratingSummary(true);
          console.log('Generating AI summary for the notice...');
          
          await generateNoticeSummary(pdfUrl, createdNotice.id);
          
          console.log('AI summary generated successfully');
        } catch (summaryError) {
          console.error('Error generating summary:', summaryError);
          // Don't fail the upload if summary generation fails
          Alert.alert(
            'Notice Uploaded',
            'Notice uploaded successfully! AI summary generation failed, but the notice is available.',
            [{ text: 'OK' }]
          );
        } finally {
          setIsGeneratingSummary(false);
        }
      }

      Alert.alert(
        'Success',
        pdfUrl ? 'Notice uploaded successfully with PDF and AI summary!' : 'Notice uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error uploading notice:', error);
      Alert.alert('Error', 'Failed to upload notice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
            <Text style={[styles.title, { color: theme.textPrimary }]}>Upload Notice</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Create new faculty notice</Text>
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
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Title *</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.surfaceColor, 
              color: theme.textPrimary,
              borderColor: theme.borderLight 
            }]}
            placeholder="Enter notice title"
            placeholderTextColor={theme.textTertiary}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>



        {/* Category Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: formData.category === category 
                      ? theme.accentSecondary 
                      : theme.surfaceColor,
                    borderColor: theme.borderLight
                  }
                ]}
                onPress={() => setFormData({ ...formData, category })}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: formData.category === category ? '#fff' : theme.textPrimary }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: formData.priority === priority.value 
                      ? theme.accentSecondary 
                      : theme.surfaceColor,
                    borderColor: theme.borderLight
                  }
                ]}
                onPress={() => setFormData({ ...formData, priority: priority.value as 'low' | 'medium' | 'high' })}
              >
                <Text style={[
                  styles.priorityChipText,
                  { color: formData.priority === priority.value ? '#fff' : theme.textPrimary }
                ]}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

                 {/* PDF Upload */}
         <View style={styles.inputGroup}>
           <Text style={[styles.label, { color: theme.textPrimary }]}>PDF Notice (Optional)</Text>
                       <Text style={[styles.infoText, { color: theme.textTertiary }]}>
              PDFs will be stored in Supabase storage and accessible to all users. Make sure your Supabase storage is properly configured.
            </Text>

          <TouchableOpacity
            style={[styles.pdfUploadButton, { 
              backgroundColor: theme.surfaceColor, 
              borderColor: theme.borderLight
            }]}
            onPress={pickPDF}
          >
            {selectedPDF ? (
              <View style={styles.pdfPreviewContainer}>
                <View style={styles.pdfInfo}>
                  <Icon name="file-pdf-o" size={32} color={theme.accentSecondary} />
                  <Text style={[styles.pdfName, { color: theme.textPrimary }]}>
                    {pdfFile?.name || 'PDF Document'}
                  </Text>
                  <Text style={[styles.pdfSize, { color: theme.textSecondary }]}>
                    PDF Document
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removePdfButton}
                  onPress={removePDF}
                >
                  <Icon name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="file-pdf-o" size={24} color={theme.textSecondary} />
                <Text style={[styles.uploadText, { color: theme.textSecondary }]}>
                  Tap to select PDF
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: (isLoading || isGeneratingSummary) ? theme.textTertiary : theme.accentSecondary,
              opacity: (isLoading || isGeneratingSummary) ? 0.7 : 1
            }
          ]}
          onPress={handleSubmit}
          disabled={isLoading || isGeneratingSummary}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : isGeneratingSummary ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.submitButtonText}>Generating AI Summary...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Upload Notice</Text>
          )}
        </TouchableOpacity>
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

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pdfUploadButton: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    marginTop: 8,
  },
  pdfPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfInfo: {
    alignItems: 'center',
  },
  pdfName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  pdfSize: {
    fontSize: 12,
    marginTop: 4,
  },
  removePdfButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

});

export default AdminNoticeUpload; 