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
  BackHandler
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';

const { width } = Dimensions.get('window');

type FacultyNoticeNavigationProp = StackNavigationProp<RootStackParamList, 'FacultyNotice'>;

// Mock data for faculty notices with images
const mockNotices = [
  {
    id: '1',
    title: 'Faculty Meeting Schedule',
    content: 'Monthly faculty meeting scheduled for next Friday at 2:00 PM in the main auditorium.',
    date: '2024-01-15T14:30:00',
    priority: 'high',
    category: 'Meeting',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Academic Calendar Update',
    content: 'Updated academic calendar for the current semester. Please review the new schedule.',
    date: '2024-01-14T09:15:00',
    priority: 'medium',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Research Grant Opportunities',
    content: 'New research grant opportunities available for faculty members. Deadline: March 1st.',
    date: '2024-01-13T16:45:00',
    priority: 'high',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Library Resources Update',
    content: 'New digital resources added to the library. Access available through the online portal.',
    date: '2024-01-12T11:20:00',
    priority: 'low',
    category: 'Resources',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'Student Feedback System',
    content: 'New student feedback system implementation. Training session scheduled for next week.',
    date: '2024-01-11T13:00:00',
    priority: 'medium',
    category: 'System',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
  }
];

const FacultyNotice = () => {
  const navigation = useNavigation<FacultyNoticeNavigationProp>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });



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

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
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
          <View style={styles.placeholder} />
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
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredNotices.length === 0 ? (
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
            >
              <View style={styles.noticeHeader}>
                <View style={styles.noticeTitleContainer}>
                  <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>
                    {notice.title}
                  </Text>
                </View>
                <View style={styles.dateTimeContainer}>
                  {(() => {
                    const dateInfo = formatDate(notice.date);
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
              
              {notice.image && (
                <TouchableOpacity 
                  style={styles.imageContainer}
                  onPress={() => handleImagePress(notice.image)}
                  activeOpacity={0.9}
                >
                  <Image 
                    source={{ uri: notice.image }} 
                    style={styles.noticeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <Icon name="expand" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
              
              <Text style={[styles.noticeContent, { color: theme.textSecondary }]}>
                {notice.content}
              </Text>
              
              <View style={styles.noticeFooter}>
                <View style={[styles.categoryBadge, { backgroundColor: theme.accentTertiary }]}>
                  <Text style={[styles.categoryText, { color: theme.textPrimary }]}>
                    {notice.category}
                  </Text>
                </View>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={[styles.readMoreText, { color: theme.accentSecondary }]}>
                    Read More
                  </Text>
                  <Icon name="arrow-right" size={12} color={theme.accentSecondary} style={styles.readMoreIcon} />
                </TouchableOpacity>
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
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  readMoreIcon: {
    marginLeft: 2,
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
});

export default FacultyNotice; 