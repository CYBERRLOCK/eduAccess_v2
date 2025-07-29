import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Text,
  Vibration,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from './theme-provider';

const { width } = Dimensions.get('window');

interface TabItem {
  key: string;
  title: string;
  icon: string;
  activeIcon?: string;
  screen: string;
  badge?: number;
}

interface EnhancedBottomNavigatorProps {
  currentScreen: string;
  onTabPress: (screen: string) => void;
}

const EnhancedBottomNavigator: React.FC<EnhancedBottomNavigatorProps> = ({ 
  currentScreen, 
  onTabPress 
}) => {
  const { theme } = useTheme();
  
  // Enhanced tabs with badges and better icons
  const tabs: TabItem[] = [
    {
      key: 'ProfileScreen',
      title: 'Profile',
      icon: 'user',
      activeIcon: 'user',
      screen: 'ProfileScreen'
    },
    {
      key: 'FacultyDirectory',
      title: 'Directory',
      icon: 'users',
      activeIcon: 'users',
      screen: 'FacultyDirectory'
    },
    {
      key: 'HomePage',
      title: 'Home',
      icon: 'home',
      activeIcon: 'home',
      screen: 'HomePage'
    },
    {
      key: 'NotificationScreen',
      title: 'Notifications',
      icon: 'bell',
      activeIcon: 'bell',
      screen: 'NotificationScreen',
      badge: 3 // Example badge count
    },
    {
      key: 'SettingsPage',
      title: 'Settings',
      icon: 'cog',
      activeIcon: 'cog',
      screen: 'SettingsPage'
    }
  ];

  const [activeTab, setActiveTab] = useState(currentScreen);
  const [floatingButtonAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rippleAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));

  const getActiveTabIndex = () => {
    return tabs.findIndex(tab => tab.key === activeTab);
  };

  const handleTabPress = (tab: TabItem, index: number) => {
    if (activeTab !== tab.key) {
      const newIndex = tabs.findIndex(t => t.key === tab.key);
      
      // Haptic feedback - simplified to avoid expo-haptics dependency
      if (Platform.OS === 'android') {
        Vibration.vibrate(50);
      }
      
      setActiveTab(tab.key);
      onTabPress(tab.screen);
      
      // Enhanced floating button animation
      Animated.parallel([
        Animated.timing(floatingButtonAnim, {
          toValue: newIndex,
          duration: 300,
          useNativeDriver: true,
        }),
        // Enhanced scale animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Ripple effect
        Animated.sequence([
          Animated.timing(rippleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rippleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Glow effect
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  // Initialize animations
  useEffect(() => {
    const activeIndex = getActiveTabIndex();
    floatingButtonAnim.setValue(activeIndex);
  }, []);

  // Calculate dimensions for perfect alignment
  const tabWidth = width / tabs.length;
  const floatingButtonSize = 56; // Slightly smaller for better alignment
  const iconSize = 22; // Match the base icon size
  const floatingButtonOffset = (tabWidth - floatingButtonSize) / 2; // Center the button within tab width

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Enhanced curved background with gradient effect */}
      <View style={[styles.curvedBackground, { backgroundColor: theme.surfaceColor }]}>
        <View style={[styles.gradientOverlay, { backgroundColor: theme.accentPrimary + '10' }]} />
      </View>

      {/* Enhanced floating active button with perfect alignment */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            backgroundColor: theme.accentPrimary,
            width: floatingButtonSize,
            height: floatingButtonSize,
            left: floatingButtonOffset, // Add left offset to center within tab
            transform: [
              {
                translateX: floatingButtonAnim.interpolate({
                  inputRange: [0, tabs.length - 1],
                  outputRange: [0, (tabs.length - 1) * tabWidth],
                }),
              },
              { scale: scaleAnim },
            ],
            shadowColor: theme.accentPrimary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 16],
            }),
            elevation: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [4, 12],
            }),
          },
        ]}
      >
        {/* Ripple effect */}
        <Animated.View
          style={[
            styles.rippleEffect,
            {
              opacity: rippleAnim,
              transform: [
                {
                  scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Icon
          name={tabs[getActiveTabIndex()]?.activeIcon || tabs[getActiveTabIndex()]?.icon}
          size={iconSize}
          color={theme.textPrimary}
        />
      </Animated.View>

      {/* Enhanced tab buttons with badges */}
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        const iconName = isActive ? (tab.activeIcon || tab.icon) : tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => handleTabPress(tab, index)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              <View>
                <Icon 
                  name={iconName} 
                  size={iconSize} 
                  color={isActive ? theme.accentPrimary : theme.textSecondary} 
                />
                {/* Badge indicator */}
                {tab.badge && tab.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.accentPrimary }]}>
                    <Text style={[styles.badgeText, { color: theme.textPrimary }]}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text 
                style={[
                  styles.tabText,
                  { 
                    color: isActive ? theme.accentPrimary : theme.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
    flexDirection: 'row',
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 0,
  },
  curvedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  floatingButton: {
    position: 'absolute',
    top: -20, // Adjusted for better alignment
    borderRadius: 28, // Half of width/height
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  rippleEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    minWidth: 0,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default EnhancedBottomNavigator; 