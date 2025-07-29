import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useTheme } from '../components/theme-provider';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

// Mock data for halls and event types
const HALLS = ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5'];
const EVENT_TYPES = ['Seminar', 'Workshop', 'Club Meet', 'Guest Lecture', 'Others'];
const STATUS_COLORS = {
  Pending: '#FF9800',
  Approved: '#4CAF50',
  Rejected: '#F44336',
};
const PRIORITY_COLORS = {
  High: '#F44336',
  Medium: '#FF9800',
  Low: '#4CAF50',
};

interface BookingRequest {
  id: string;
  hall: string;
  eventTitle: string;
  eventType: string;
  date: Date;
  time: string;
  audienceSize?: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  facultyName: string;
  submittedAt: Date;
}

const HallBooking: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin view
  const [activeTab, setActiveTab] = useState<'book' | 'requests' | 'admin'>('book');

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);
  
  // Form state
  const [selectedHall, setSelectedHall] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [audienceSize, setAudienceSize] = useState('');
  const [description, setDescription] = useState('');
  
  // Mock data
  const [myRequests, setMyRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      hall: 'Hall 2',
      eventTitle: 'AI Workshop',
      eventType: 'Workshop',
      date: new Date(Date.now() + 86400000),
      time: '14:00',
      audienceSize: 50,
      description: 'Introduction to AI and Machine Learning',
      status: 'Pending',
      priority: 'Medium',
      facultyName: 'Dr. John Doe',
      submittedAt: new Date(),
    },
    {
      id: '2',
      hall: 'Hall 1',
      eventTitle: 'Tech Seminar',
      eventType: 'Seminar',
      date: new Date(Date.now() + 172800000),
      time: '10:00',
      audienceSize: 30,
      description: 'Latest trends in technology',
      status: 'Approved',
      priority: 'High',
      facultyName: 'Dr. John Doe',
      submittedAt: new Date(Date.now() - 86400000),
    },
  ]);
  
  const [allPendingRequests, setAllPendingRequests] = useState<BookingRequest[]>([
    {
      id: '3',
      hall: 'Hall 3',
      eventTitle: 'Student Club Meeting',
      eventType: 'Club Meet',
      date: new Date(Date.now() + 259200000),
      time: '16:00',
      audienceSize: 25,
      description: 'Monthly coding club meeting',
      status: 'Pending',
      priority: 'Low',
      facultyName: 'Dr. Jane Smith',
      submittedAt: new Date(Date.now() - 3600000),
    },
  ]);

  const handleSubmitBooking = () => {
    if (!selectedHall || !eventTitle || !selectedEventType || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRequest: BookingRequest = {
      id: Date.now().toString(),
      hall: selectedHall,
      eventTitle,
      eventType: selectedEventType,
      date: selectedDate,
      time: selectedTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      audienceSize: audienceSize ? parseInt(audienceSize) : undefined,
      description,
      status: 'Pending',
      priority: 'Medium',
      facultyName: 'Dr. John Doe', // Mock faculty name
      submittedAt: new Date(),
    };

    setMyRequests([newRequest, ...myRequests]);
    setAllPendingRequests([newRequest, ...allPendingRequests]);
    
    // Reset form
    setSelectedHall('');
    setEventTitle('');
    setSelectedEventType('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setAudienceSize('');
    setDescription('');
    
    Alert.alert('Success', 'Booking request submitted successfully!');
  };

  const handleAdminAction = (requestId: string, action: 'approve' | 'reject') => {
    const updatedRequests = allPendingRequests.filter(req => req.id !== requestId);
    setAllPendingRequests(updatedRequests);
    
    const updatedMyRequests = myRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'approve' ? 'Approved' as const : 'Rejected' as const }
        : req
    );
    setMyRequests(updatedMyRequests);
    
    Alert.alert(
      'Success', 
      `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      paddingTop: StatusBar.currentHeight || 0,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.surfaceColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    backButton: {
      padding: 8,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceColor,
      marginHorizontal: 20,
      marginTop: 15,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.accentPrimary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    activeTabText: {
      color: theme.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    section: {
      backgroundColor: theme.cardColor,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 15,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.surfaceColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.textPrimary,
    },
    pickerContainer: {
      backgroundColor: theme.surfaceColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      overflow: 'hidden',
    },
    dateTimeButton: {
      backgroundColor: theme.surfaceColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateTimeText: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    submitButton: {
      backgroundColor: theme.accentPrimary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    requestCard: {
      backgroundColor: theme.surfaceColor,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 4,
      elevation: 2,
    },
    requestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    requestTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginLeft: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#fff',
    },
    requestDetails: {
      marginBottom: 8,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      width: 80,
    },
    detailValue: {
      fontSize: 14,
      color: theme.textPrimary,
      flex: 1,
    },
    priorityBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: '500',
      color: '#fff',
    },
    adminActions: {
      flexDirection: 'row',
      marginTop: 12,
      gap: 8,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    approveButton: {
      backgroundColor: theme.success,
    },
    rejectButton: {
      backgroundColor: theme.error,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#fff',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIcon: {
      fontSize: 48,
      color: theme.textTertiary,
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    adminToggle: {
      position: 'absolute',
      top: 60,
      right: 20,
      backgroundColor: theme.accentSecondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    adminToggleText: {
      fontSize: 12,
      color: theme.textPrimary,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Hall / Event Space</Text>
        <View style={{ width: 36 }} />
      </View>

      <TouchableOpacity 
        style={styles.adminToggle}
        onPress={() => setIsAdmin(!isAdmin)}
      >
        <Text style={styles.adminToggleText}>
          {isAdmin ? 'Faculty View' : 'Admin View'}
        </Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'book' && styles.activeTab]}
          onPress={() => setActiveTab('book')}
        >
          <Text style={[styles.tabText, activeTab === 'book' && styles.activeTabText]}>
            Book Hall
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            My Requests
          </Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'admin' && styles.activeTab]}
            onPress={() => setActiveTab('admin')}
          >
            <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>
              Admin Panel
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'book' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Form</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Hall *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedHall}
                  onValueChange={setSelectedHall}
                  style={{ color: theme.textPrimary }}
                >
                  <Picker.Item label="Choose a hall..." value="" />
                  {HALLS.map(hall => (
                    <Picker.Item key={hall} label={hall} value={hall} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="Enter event title"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedEventType}
                  onValueChange={setSelectedEventType}
                  style={{ color: theme.textPrimary }}
                >
                  <Picker.Item label="Choose event type..." value="" />
                  {EVENT_TYPES.map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatDate(selectedDate)}
                </Text>
                <Icon name="calendar" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time *</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {selectedTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </Text>
                <Icon name="clock-o" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Audience Size (Optional)</Text>
              <TextInput
                style={styles.input}
                value={audienceSize}
                onChangeText={setAudienceSize}
                placeholder="Enter expected audience size"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Description / Purpose *</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your event and its purpose..."
                placeholderTextColor={theme.textTertiary}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBooking}>
              <Text style={styles.submitButtonText}>Submit Booking Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'requests' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Booking Requests</Text>
            {myRequests.length > 0 ? (
              myRequests.map(request => (
                <View 
                  key={request.id} 
                  style={[
                    styles.requestCard,
                    { borderLeftColor: STATUS_COLORS[request.status] }
                  ]}
                >
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestTitle}>{request.eventTitle}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[request.status] }
                    ]}>
                      <Text style={styles.statusText}>{request.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.requestDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hall:</Text>
                      <Text style={styles.detailValue}>{request.hall}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{request.eventType}</Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: PRIORITY_COLORS[request.priority] }
                      ]}>
                        <Text style={styles.priorityText}>{request.priority}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(request.date)} at {request.time}
                      </Text>
                    </View>
                    {request.audienceSize && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Audience:</Text>
                        <Text style={styles.detailValue}>{request.audienceSize} people</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="calendar-times-o" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No booking requests yet</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'admin' && isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {allPendingRequests.length > 0 ? (
              allPendingRequests.map(request => (
                <View 
                  key={request.id} 
                  style={[
                    styles.requestCard,
                    { borderLeftColor: STATUS_COLORS[request.status] }
                  ]}
                >
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestTitle}>{request.eventTitle}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[request.status] }
                    ]}>
                      <Text style={styles.statusText}>{request.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.requestDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Faculty:</Text>
                      <Text style={styles.detailValue}>{request.facultyName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hall:</Text>
                      <Text style={styles.detailValue}>{request.hall}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{request.eventType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(request.date)} at {request.time}
                      </Text>
                    </View>
                    {request.audienceSize && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Audience:</Text>
                        <Text style={styles.detailValue}>{request.audienceSize} people</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Description:</Text>
                      <Text style={styles.detailValue}>{request.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.adminActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleAdminAction(request.id, 'approve')}
                    >
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAdminAction(request.id, 'reject')}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="check-circle-o" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setSelectedTime(time);
          }}
        />
      )}
    </View>
  );
};

export default HallBooking; 