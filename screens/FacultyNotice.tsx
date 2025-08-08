import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Dimensions,
  StatusBar,
  Image,
  Modal,
  BackHandler,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';
import { fetchFacultyNotices, searchFacultyNotices, cleanupOldNotices, deleteFacultyNotice, type FacultyNotice } from '../api/noticesApi';

const { width } = Dimensions.get('window');

type FacultyNoticeNavigationProp = StackNavigationProp<RootStackParamList, 'FacultyNotice'>;

const FacultyNotice = () => {
  const navigation = useNavigation<FacultyNoticeNavigationProp>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [notices, setNotices] = useState<FacultyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTabs');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Load notices on component mount
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      
      // Clean up old notices with invalid URLs
      await cleanupOldNotices();
      
      const data = await fetchFacultyNotices();
      setNotices(data);
    } catch (error) {
      console.error('Error loading notices:', error);
      Alert.alert('Error', 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotices();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await searchFacultyNotices(query);
        setNotices(searchResults);
      } catch (error) {
        console.error('Error searching notices:', error);
      }
    } else {
      loadNotices();
    }
  };

  const filteredNotices = notices;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return { day, date: dateStr, time };
  };

  const handlePDFPress = async (pdfUrl: string) => {
    try {
      console.log('Opening PDF URL:', pdfUrl);
      
      // Validate URL
      if (!pdfUrl || !pdfUrl.startsWith('https://')) {
        Alert.alert(
          'Error',
          'Invalid PDF URL. The PDF may not be available.',
          [
            { text: 'OK' }
          ]
        );
        return;
      }

      // Open PDF directly in browser
      try {
        const canOpen = await Linking.canOpenURL(pdfUrl);
        if (canOpen) {
          await Linking.openURL(pdfUrl);
          console.log('PDF opened in browser');
        } else {
          await Linking.openURL(pdfUrl);
          console.log('PDF opened in external app');
        }
      } catch (error) {
        console.error('Error opening PDF in browser:', error);
        Alert.alert('Error', 'Unable to open PDF in browser');
      }
      
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert(
        'PDF Viewer',
        'Unable to open PDF. Please check your internet connection or try again later.',
        [
          { text: 'OK' }
        ]
      );
    }
  };



  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
  };

  // Convert PDF URL to image URL using a PDF to image service
  const convertPDFToImageUrl = (pdfUrl: string): string => {
    // Option 1: If you have image versions of PDFs with same name (recommended)
    // Upload both PDF and PNG versions to your storage with same name
    const imageUrl = pdfUrl.replace('.pdf', '.png');
    
    // Option 2: Use a PDF to image conversion API (requires setup)
    // const imageUrl = `https://api.pdf2image.com/convert?url=${encodeURIComponent(pdfUrl)}&format=png&page=1`;
    
    // Option 3: Use Google Docs Viewer (temporary solution)
    // const imageUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    
    // Option 4: Use a cloud conversion service like CloudConvert
    // const imageUrl = `https://api.cloudconvert.com/v2/convert?input=${encodeURIComponent(pdfUrl)}&outputformat=png`;
    
    return imageUrl;
  };

  // Build a preview URL suitable for WebView (use Google Drive viewer as a universal fallback)
  const getPdfPreviewUrl = (pdfUrl: string): string => {
    // Some CDNs require embedding via Google Docs Viewer for inline preview in WebView
    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`;
  };

  const handleDeleteNotice = async (noticeId: string, noticeTitle: string) => {
    Alert.alert(
      'Delete Notice',
      `Are you sure you want to delete "${noticeTitle}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFacultyNotice(noticeId);
              Alert.alert('Success', 'Notice deleted successfully');
              // Reload notices after deletion
              loadNotices();
            } catch (error) {
              console.error('Error deleting notice:', error);
              Alert.alert('Error', 'Failed to delete notice. Please try again.');
            }
          },
        },
      ]
    );
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
             <Text style={[styles.title, { color: theme.textPrimary }]}>Faculty Notice</Text>
             <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Important announcements</Text>
           </View>
           <View style={styles.headerActions}>
             <TouchableOpacity 
               style={[styles.refreshButton, { 
                 backgroundColor: theme.surfaceColor, 
                 borderColor: theme.borderLight,
                 opacity: refreshing ? 0.7 : 1
               }]}
               onPress={onRefresh}
               disabled={refreshing}
             >
               {refreshing ? (
                 <ActivityIndicator size="small" color={theme.textPrimary} />
               ) : (
                 <Icon name="refresh" size={16} color={theme.textPrimary} />
               )}
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.uploadButton, { backgroundColor: theme.accentSecondary }]}
               onPress={() => navigation.navigate('AdminNoticeUpload')}
             >
               <Icon name="plus" size={16} color="#fff" />
             </TouchableOpacity>
           </View>
         </View>
       </View>



      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: theme.backgroundColor }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surfaceColor, shadowColor: theme.shadowColor }]}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput 
              style={[styles.searchInput, { color: theme.textPrimary }]} 
              placeholder="Search notices..." 
              placeholderTextColor={theme.textTertiary} 
              value={searchQuery} 
              onChangeText={handleSearch} 
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
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.accentSecondary]}
            tintColor={theme.accentSecondary}
          />
        }
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.accentSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Loading notices...
            </Text>
          </View>
        ) : filteredNotices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-slash" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No notices found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredNotices.map((notice) => (
                         <TouchableOpacity 
               key={notice.id} 
               style={[styles.noticeCard, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}
               activeOpacity={0.9}
               onLongPress={() => handleDeleteNotice(notice.id, notice.title)}
             >
              <View style={styles.noticeHeader}>
                <View style={styles.noticeTitleContainer}>
                  <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>
                    {notice.title}
                  </Text>
                </View>
                <View style={styles.dateTimeContainer}>
                  {(() => {
                    const dateInfo = formatDate(notice.created_at);
                    return (
                      <>
                        <Text style={[styles.noticeDay, { color: theme.textSecondary }]}>
                          {dateInfo.day}
                        </Text>
                        <Text style={[styles.noticeDate, { color: theme.textTertiary }]}>
                          {dateInfo.date}
                        </Text>
                        <Text style={[styles.noticeTime, { color: theme.textTertiary }]}>
                          {dateInfo.time}
                        </Text>
                      </>
                    );
                  })()}
                </View>
              </View>
              
                             <Text style={[styles.noticeContent, { color: theme.textSecondary }]}>
                 {notice.content}
               </Text>
               
               {/* AI Summary Section - Hidden but data preserved for search */}
               {/* {notice.summary && (
                 <View style={[styles.summaryContainer, { backgroundColor: theme.accentTertiary }]}>
                   <View style={styles.summaryHeader}>
                     <Icon name="magic" size={16} color={theme.accentSecondary} />
                     <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
                       AI Summary
                     </Text>
                   </View>
                   <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
                     {notice.summary}
                   </Text>
                 </View>
               )} */}
               
                {/* PDF Notice Section - Inline WebView Preview */}
                {notice.pdf_url && (
                  <View style={styles.pdfPreviewContainer}>
                    <Text style={[styles.pdfImageTitle, { color: theme.textPrimary }]}>Notice Preview</Text>
                    <View style={styles.pdfPreview}>
                      <WebView
                        source={{ uri: getPdfPreviewUrl(notice.pdf_url!) }}
                        style={{ flex: 1 }}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.openPdfButton, { backgroundColor: theme.accentSecondary }]}
                      onPress={() => handlePDFPress(notice.pdf_url!)}
                      activeOpacity={0.9}
                    >
                      <Icon name="external-link" size={14} color="#fff" />
                      <Text style={styles.openPdfText}>Open PDF</Text>
                    </TouchableOpacity>
                  </View>
                )}
              
                                                           <View style={styles.noticeFooter}>
                  <View style={styles.footerLeft}>
                    <View style={[styles.categoryBadge, { backgroundColor: theme.accentTertiary }]}>
                      <Text style={[styles.categoryText, { color: theme.textPrimary }]}>
                        {notice.category}
                      </Text>
                    </View>
                    <View style={[styles.priorityBadge, { 
                      backgroundColor: notice.priority === 'high' ? '#ff6b6b' : 
                                   notice.priority === 'medium' ? '#ffd93d' : '#6bcf7f'
                    }]}>
                      <Text style={[styles.priorityText, { color: '#fff' }]}>
                        {notice.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.footerActions}>
                    <TouchableOpacity 
                      style={[styles.deleteButton, { backgroundColor: theme.error }]}
                      onPress={() => handleDeleteNotice(notice.id, notice.title)}
                    >
                      <Icon name="trash" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
            </TouchableOpacity>
          ))
        )}
        
        {/* Empty container at bottom */}
        <View style={styles.bottomContainer} />
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        visible={imageViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <View style={styles.imageViewerHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeImageViewer}
            >
              <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>


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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  searchContainer: {
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
  },
  clearButton: {
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  noticeCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noticeTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 22,
  },
  noticeDate: {
    fontSize: 12,
    fontWeight: '400',
  },
  noticeContent: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 16,
  },
  noticeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },

  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    height: 60,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  noticeDay: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  noticeTime: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  imageContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  noticeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
  pdfContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  pdfInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pdfText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pdfSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 50,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  summaryContainer: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(59, 130, 246, 0.3)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  // PDF Image Display Styles
  pdfPreviewContainer: {
    marginVertical: 12,
  },
  pdfPreview: {
    height: 260,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  openPdfButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  openPdfText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pdfImageContainer: {
    marginVertical: 12,
  },
  pdfImageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pdfImageWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  pdfImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  pdfImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  pdfImageOverlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default FacultyNotice;