import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  StatusBar,
  BackHandler,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

interface MenuItem {
  title: string;
  icon: string;
  screen: string;
  description: string;
}

const HomePage: React.FC = () => {
  const navigation = useNavigation<HomePageNavigationProp>();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  
  // Admin email detection
  const adminEmails = [
    "jayakrishans2026@cy.sjcetpalai.ac.in",
  ];
  
  const isAdmin = true; // This should be set based on login state

  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Exit EduAccess',
          'Do you want to exit EduAccess?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: true }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [])
  );
  
  const menuItems: MenuItem[] = [
    { 
      title: 'Faculty Directory', 
      icon: 'users', 
      screen: 'FacultyDirectory',
      description: 'Browse faculty members and departments'
    },
    { 
      title: 'Hall Booking', 
      icon: 'calendar-check-o', 
      screen: 'HallBooking',
      description: 'Book halls and meeting rooms'
    },
    { 
      title: 'Faculty Notice', 
      icon: 'bullhorn', 
      screen: 'FacultyNotice',
      description: 'View important announcements'
    },
    { 
      title: 'Exam Duty', 
      icon: 'file-text-o', 
      screen: 'ExamDuty',
      description: 'Manage exam schedules and duties'
    },
    { 
      title: 'Leave Request', 
      icon: 'file-o', 
      screen: 'LeaveRequest',
      description: 'Submit and track leave requests'
    },
  ];

  const adminMenuItems: MenuItem[] = [
    ...menuItems,
    {
      title: 'Exam Seating Arrangement',
      icon: 'th-large',
      screen: 'ExamSeatingArrangement',
      description: 'Manage exam seating arrangements'
    }
  ];

  const handleCardPress = (index: number, screen: string) => {
    setSelectedCard(index);
    navigation.navigate(screen as any);
    setSelectedCard(null);
  };

  const renderCard = (item: MenuItem, index: number) => (
    <View key={index} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          selectedCard === index && styles.cardPressed
        ]}
        onPress={() => handleCardPress(index, item.screen)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Icon name={item.icon} size={32} color="#2c2c2c" />
            </View>
            <View style={styles.cardArrowContainer}>
              <Icon name="arrow-right" size={14} color="#666" />
            </View>
          </View>
          
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f1e4" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }} 
              style={styles.logo} 
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>EduAccess</Text>
            </View>
          </View>
          
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <Icon name="bell" size={20} color="#2c2c2c" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("SettingsPage")}
            >
              <Icon name="cog" size={20} color="#2c2c2c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >


        <View style={styles.grid}>
          {(isAdmin ? adminMenuItems : menuItems).map((item, index) => 
            renderCard(item, index)
          )}
        </View>
      </ScrollView>
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
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  titleContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c2c2c",
    lineHeight: 28,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardContainer: {
    width: (width - 72) / 2,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#f3e2c7",
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    height: 250,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.08,
  },
  cardContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardArrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2c2c',
    lineHeight: 24,
    textAlign: 'left',
  },
});

export default HomePage; 