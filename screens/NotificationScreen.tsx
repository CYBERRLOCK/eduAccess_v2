import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Animated, Image, BackHandler, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "../components/theme-provider";
import { fetchNotifications, type Notification } from "../api/notificationApi";

import type { RootStackParamList } from "../App";



const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  // Back button logic to navigate back to MainScreen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MainTabs', { screen: 'Home' });
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Load notifications from database
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    loadNotifications();
  }, []);

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

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

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification.title);
    
    // Navigate to FacultyNotice screen for notice-related notifications
    if (notification.title.includes('Faculty Notice') || 
        notification.title.includes('Notice Published') ||
        notification.title.includes('New Faculty Notice')) {
      console.log('Navigating to FacultyNotice');
      navigation.navigate('FacultyNotice');
    } else {
      console.log('No navigation for this notification type, but navigating anyway for testing');
      // For testing purposes, navigate to FacultyNotice for all notifications
      navigation.navigate('FacultyNotice');
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <TouchableOpacity
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
      onPress={() => {
        console.log('TouchableOpacity pressed for:', notification.title);
        handleNotificationPress(notification);
      }}
      onPressIn={() => console.log('Press in detected')}
      activeOpacity={0.6}
      delayPressIn={0}
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
      
      <View style={styles.notificationRight}>
        <Text style={[styles.notificationTimestamp, { color: theme.textTertiary }]}>
          {notification.timestamp}
        </Text>
        <Icon 
          name="chevron-right" 
          size={16} 
          color={theme.textTertiary} 
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
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
            <Text style={[styles.title, { color: theme.textPrimary }]}>Notifications</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stay updated with latest updates</Text>
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
         {isLoading ? (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="large" color={theme.accentPrimary} />
             <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
               Loading notifications...
             </Text>
           </View>
         ) : notifications.length > 0 ? (
           <Animated.View style={{ opacity: fadeAnim }}>
             {notifications.map(renderNotificationCard)}
           </Animated.View>
         ) : (
           <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
             <View style={[styles.emptyIconContainer, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}>
               <Icon 
                 name="bell-o" 
                 size={48} 
                 color={theme.textSecondary} 
               />
             </View>
             
             <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
               No Notifications Yet
             </Text>
             <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
    // Ensure proper touch target
    minWidth: 44,
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
  notificationRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  notificationTimestamp: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'right',
    opacity: 0.6,
    marginBottom: 4,
  },
  chevronIcon: {
    marginTop: 2,
  },
});

export default NotificationScreen;