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
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../components/theme-provider';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

interface MenuItem {
  title: string;
  icon: string;
  screen: string;
  description: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  
  // Admin email detection
  const adminEmails = [
    "jayakrishans2026@cy.sjcetpalai.ac.in",
  ];
  
  const isAdmin = true; // This should be set based on login state

  // Fade-in animation on component mount
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
      icon: 'graduation-cap', 
      screen: 'ExamDuty',
      description: 'Assign exam duties to faculty members'
    },
  ];

  const adminMenuItems: MenuItem[] = [
    { 
      title: 'Exam Seating', 
      icon: 'th-large', 
      screen: 'ExamSeatingArrangement',
      description: 'Arrange exam seating assignments'
    },
  ];

  const handleCardPress = (index: number, screen: string) => {
    setSelectedCard(index);
    setTimeout(() => {
      setSelectedCard(null);
      // Navigate to the specific screen
      if (screen === 'FacultyDirectory') {
        navigation.navigate('FacultyDirectory');
      } else if (screen === 'HallBooking') {
        navigation.navigate('HallBooking');
      } else if (screen === 'FacultyNotice') {
        navigation.navigate('FacultyNotice');
      } else if (screen === 'ExamDuty') {
        navigation.navigate('ExamDuty');
      } else if (screen === 'ExamSeatingArrangement') {
        navigation.navigate('ExamSeatingArrangement');
      }
    }, 150);
  };

  const renderCard = (item: MenuItem, index: number) => (
    <Animated.View
      key={item.title}
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.cardColor },
          selectedCard === index && styles.cardPressed
        ]}
        onPress={() => handleCardPress(index, item.screen)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardIconContainer}>
            <Icon name={item.icon} size={32} color={theme.textPrimary} />
          </View>
          
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{item.description}</Text>
          </View>
        </View>
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
      
      <StatusBar barStyle="dark-content" backgroundColor="#f8f1e4" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <Image 
              source={require('../components/MainLogo.png')} 
              style={styles.logo}
            />
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>EduAccess</Text>
            </View>
          </View>
          
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.surfaceColor }]}
              onPress={() => navigation.navigate('NotificationScreen')}
            >
              <Icon name="bell" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.surfaceColor }]}
              onPress={() => navigation.navigate('SettingsPage')}
            >
              <Icon name="cog" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {menuItems.map((item, index) => renderCard(item, index))}
          {isAdmin && adminMenuItems.map((item, index) => renderCard(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
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
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  titleContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 32,
    paddingBottom: 48,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardContainer: {
    width: (width - 96) / 2,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
    letterSpacing: 0,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

});

export default HomeScreen; 