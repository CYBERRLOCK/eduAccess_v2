import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Dimensions,
  StatusBar,
  Modal,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';

const { width } = Dimensions.get('window');

type ExamSeatingArrangementNavigationProp = StackNavigationProp<RootStackParamList, 'ExamSeatingArrangement'>;

// Mock data for exam seating arrangements
const mockSeatingArrangements = [
  {
    id: '1',
    examName: 'End Semester Examination',
    date: '2024-01-20',
    time: '09:00 AM - 12:00 PM',
    hall: 'Main Auditorium',
    totalStudents: 120,
    status: 'Active'
  },
  {
    id: '2',
    examName: 'Mid Semester Test',
    date: '2024-01-25',
    time: '02:00 PM - 04:00 PM',
    hall: 'Computer Lab 1',
    totalStudents: 45,
    status: 'Scheduled'
  },
  {
    id: '3',
    examName: 'Practical Examination',
    date: '2024-01-30',
    time: '10:00 AM - 01:00 PM',
    hall: 'Lab Complex A',
    totalStudents: 80,
    status: 'Draft'
  }
];

const ExamSeatingArrangement = () => {
  const navigation = useNavigation<ExamSeatingArrangementNavigationProp>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [seatingArrangements, setSeatingArrangements] = useState(mockSeatingArrangements);

  const filteredArrangements = seatingArrangements.filter(arrangement =>
    arrangement.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arrangement.hall.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return theme.success;
      case 'Scheduled':
        return theme.warning;
      case 'Draft':
        return theme.textSecondary;
      default:
        return theme.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleAddArrangement = () => {
    setShowAddModal(true);
  };

  const handleEditArrangement = (id: string) => {
    Alert.alert('Edit', `Edit arrangement ${id}`);
  };

  const handleDeleteArrangement = (id: string) => {
    Alert.alert(
      'Delete Arrangement',
      'Are you sure you want to delete this seating arrangement?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSeatingArrangements(arrangements => 
              arrangements.filter(arr => arr.id !== id)
            );
          }
        }
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
            <Text style={[styles.title, { color: theme.textPrimary }]}>Exam Seating</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Arrangement Management</Text>
          </View>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.accentSecondary }]}
            onPress={handleAddArrangement}
          >
            <Icon name="plus" size={20} color="#fff" />
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
              placeholder="Search arrangements..." 
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
        {filteredArrangements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="th-large" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No seating arrangements found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Create your first arrangement
            </Text>
          </View>
        ) : (
          filteredArrangements.map((arrangement) => (
            <TouchableOpacity 
              key={arrangement.id} 
              style={[styles.arrangementCard, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}
              activeOpacity={0.9}
            >
              <View style={styles.arrangementHeader}>
                <View style={styles.arrangementTitleContainer}>
                  <Text style={[styles.arrangementTitle, { color: theme.textPrimary }]}>
                    {arrangement.examName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(arrangement.status) }]}>
                    <Text style={styles.statusText}>
                      {arrangement.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.arrangementActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: theme.accentTertiary }]}
                    onPress={() => handleEditArrangement(arrangement.id)}
                  >
                    <Icon name="edit" size={16} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: theme.error }]}
                    onPress={() => handleDeleteArrangement(arrangement.id)}
                  >
                    <Icon name="trash" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.arrangementDetails}>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={14} color={theme.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    {formatDate(arrangement.date)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="clock-o" size={14} color={theme.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    {arrangement.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="building" size={14} color={theme.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    {arrangement.hall}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="users" size={14} color={theme.textSecondary} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    {arrangement.totalStudents} students
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={[styles.viewDetailsText, { color: theme.accentSecondary }]}>
                  View Seating Plan
                </Text>
                <Icon name="arrow-right" size={12} color={theme.accentSecondary} style={styles.viewDetailsIcon} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        
        {/* Empty container at bottom */}
        <View style={styles.bottomContainer} />
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Add Seating Arrangement
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon name="times" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Create a new exam seating arrangement
            </Text>
            {/* Add form fields here */}
          </ScrollView>
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
  addButton: {
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
  arrangementCard: {
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
  arrangementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  arrangementTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrangementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  arrangementActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrangementDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    width: 16,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '400',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  viewDetailsIcon: {
    marginLeft: 2,
  },
  bottomContainer: {
    height: 60,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ExamSeatingArrangement; 