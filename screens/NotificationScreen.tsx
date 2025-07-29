import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "../components/theme-provider";
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  HomePage: undefined;
};

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  isRead: boolean;
}

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications to demonstrate the design
    {
      id: '1',
      title: 'New Faculty Notice Posted',
      description: 'A new announcement has been posted in the Faculty Notice section.',
      timestamp: '2m ago',
      type: 'info',
      isRead: false,
    },
    {
      id: '2',
      title: 'Hall Booking Approved',
      description: 'Your request for Hall 2 has been approved for the AI Workshop.',
      timestamp: '1h ago',
      type: 'success',
      isRead: true,
    },
    {
      id: '3',
      title: 'System Maintenance Alert',
      description: 'Scheduled maintenance will occur tonight from 10 PM to 2 AM.',
      timestamp: '3h ago',
      type: 'warning',
      isRead: false,
    },
  ]);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return 'info-circle';
      case 'alert': return 'exclamation-triangle';
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-circle';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'alert': return '#F44336';
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      default: return theme.accentPrimary;
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <Animated.View
      key={notification.id}
      style={[
        styles.notificationCard,
        {
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderLight,
          shadowColor: theme.shadowColor,
          opacity: notification.isRead ? 0.7 : 1,
        }
      ]}
    >
      <View style={styles.notificationIcon}>
        <Icon 
          name={getNotificationIcon(notification.type)} 
          size={20} 
          color={getNotificationColor(notification.type)} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.textPrimary }]}>
          {notification.title}
        </Text>
        <Text style={[styles.notificationDescription, { color: theme.textSecondary }]}>
          {notification.description}
        </Text>
      </View>
      
      <Text style={[styles.notificationTimestamp, { color: theme.textTertiary }]}>
        {notification.timestamp}
      </Text>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Gradient Background */}
      <LinearGradient
        colors={[theme.backgroundColor, theme.accentTertiary + '20', theme.backgroundColor]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.surfaceColor + '80', borderColor: theme.borderLight }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Notifications</Text>
            <Text style={[styles.subtitle, { color: theme.textTertiary }]}>Stay updated with latest updates</Text>
          </View>

          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {notifications.length > 0 ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            {notifications.map(renderNotificationCard)}
          </Animated.View>
        ) : (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            {/* Glow Effect Container */}
            <View style={[styles.glowContainer, { backgroundColor: theme.accentTertiary + '30' }]}>
              <Icon 
                name="bell-o" 
                size={56} 
                color={theme.accentPrimary} 
                style={styles.emptyIcon} 
              />
            </View>
            
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              No Notifications Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              You'll see important updates and announcements here when they become available.
            </Text>
          </Animated.View>
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
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    height: 100,
    elevation: 0,
    shadowOpacity: 0,
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
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 2,
    lineHeight: 20,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  glowContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyIcon: {
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    opacity: 0.7,
    fontWeight: '400',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 80,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  notificationTimestamp: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'right',
    opacity: 0.6,
  },
});

export default NotificationScreen;