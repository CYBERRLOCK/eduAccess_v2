import React, { useState, useEffect } from 'react';
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


const { width, height } = Dimensions.get('window');

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const HomePage = () => {
  const navigation = useNavigation<HomePageNavigationProp>();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Handle back button press - ONLY when Home screen is focused
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
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      // Cleanup when screen loses focus
      return () => {
        backHandler.remove();
      };
    }, [])
  );
  
  const menuItems = [
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







  const handleCardPress = (index: number, screen: string) => {
    setSelectedCard(index);
    navigation.navigate(screen as any);
    setSelectedCard(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Image 
              source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }} 
              style={styles.logo} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>EduAccess</Text>
            <Text style={styles.subtitle}>Faculty Management System</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <Icon name="bell" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("SettingsPage")}
            >
              <Icon name="cog" size={20} color="#000" />
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
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.descriptionText}>
          Choose a service to get started
        </Text>

        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              style={styles.cardContainer}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleCardPress(index, item.screen)}
                activeOpacity={0.9}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Icon name={item.icon} size={32} color="#000" />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  
                  {/* Arrow */}
                  <View style={styles.arrowContainer}>
                    <Icon name="arrow-right" size={16} color="#000" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
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
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 12,
    lineHeight: 30,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cardContainer: {
    width: (width - 72) / 2,
    marginBottom: 24,
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
  },
  cardContent: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    lineHeight: 20,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
});

export default HomePage; 