import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Animated,
  BackHandler,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../components/theme-provider';

type ExamDutyNavigationProp = StackNavigationProp<RootStackParamList, 'ExamDuty'>;

interface ExamDuty {
  id: string;
  facultyName: string;
  examDate: string;
  examTime: string;
  subject: string;
  room: string;
  status: 'pending' | 'assigned' | 'completed';
}

const ExamDuty: React.FC = () => {
  const navigation = useNavigation<ExamDutyNavigationProp>();
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const [examDuties, setExamDuties] = useState<ExamDuty[]>([
    {
      id: '1',
      facultyName: 'Dr. John Smith',
      examDate: '2024-01-15',
      examTime: '09:00 AM',
      subject: 'Computer Science',
      room: 'A101',
      status: 'assigned'
    },
    {
      id: '2',
      facultyName: 'Prof. Sarah Johnson',
      examDate: '2024-01-16',
      examTime: '02:00 PM',
      subject: 'Mathematics',
      room: 'B205',
      status: 'pending'
    },
    {
      id: '3',
      facultyName: 'Dr. Michael Brown',
      examDate: '2024-01-17',
      examTime: '10:30 AM',
      subject: 'Physics',
      room: 'C301',
      status: 'completed'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'assigned' | 'completed'>('all');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Back button logic to navigate back to MainScreen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MainScreen');
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const filteredDuties = examDuties.filter(duty => 
    selectedFilter === 'all' ? true : duty.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'assigned': return '#007AFF';
      case 'completed': return '#34C759';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const handleAssignDuty = (dutyId: string) => {
    Alert.alert(
      'Assign Exam Duty',
      'Are you sure you want to assign this exam duty?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            setExamDuties(prev => 
              prev.map(duty => 
                duty.id === dutyId 
                  ? { ...duty, status: 'assigned' as const }
                  : duty
              )
            );
          }
        }
      ]
    );
  };

  const renderDutyCard = (duty: ExamDuty) => (
    <Animated.View
      key={duty.id}
      style={[
        styles.dutyCard,
        { backgroundColor: theme.cardColor },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.facultyInfo}>
          <Icon name="user" size={16} color={theme.textSecondary} />
          <Text style={[styles.facultyName, { color: theme.textPrimary }]}>
            {duty.facultyName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(duty.status) }]}>
          <Text style={styles.statusText}>{getStatusText(duty.status)}</Text>
        </View>
      </View>

      <View style={styles.dutyDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar" size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {duty.examDate} at {duty.examTime}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="book" size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {duty.subject}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            Room {duty.room}
          </Text>
        </View>
      </View>

      {duty.status === 'pending' && (
        <TouchableOpacity
          style={[styles.assignButton, { backgroundColor: theme.accentPrimary }]}
          onPress={() => handleAssignDuty(duty.id)}
        >
          <Text style={styles.assignButtonText}>Assign Duty</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f1e4" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Exam Duty</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Manage exam duty assignments
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: theme.surfaceColor }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'assigned', label: 'Assigned' },
            { key: 'completed', label: 'Completed' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && { backgroundColor: theme.accentPrimary }
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.key ? '#fff' : theme.textSecondary }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredDuties.length > 0 ? (
          filteredDuties.map(renderDutyCard)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar-times-o" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No exam duties found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  dutyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  facultyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  facultyName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dutyDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  assignButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});

export default ExamDuty; 