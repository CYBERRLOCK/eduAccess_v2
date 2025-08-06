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
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
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

const EnhancedBottomNavigator: React.FC<BottomTabBarProps> = ({ 
  state,
  descriptors,
  navigation
}) => {
  const { theme } = useTheme();
  
  // Map navigation state to our tab format
  const tabs: TabItem[] = state.routes.map(route => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : route.name;
        
    // Map route names to icons
    let icon = 'circle';
    switch(route.name) {
      case 'Home':
        icon = 'home';
        break;
      case 'Directory':
        icon = 'users';
        break;
      case 'Profile':
        icon = 'user';
        break;
      case 'ExamSeating':
        icon = 'th-large';
        break;
      case 'Settings':
        icon = 'cog';
        break;
    }
    
    return {
      key: route.key,
      title: label.toString(),
      icon: icon,
      activeIcon: icon,
      screen: route.name,
      badge: options.tabBarBadge ? Number(options.tabBarBadge) : undefined
    };
  });

  const [activeTab, setActiveTab] = useState<string>(state.routes[state.index].key);
  const [floatingButtonAnim] = useState(new Animated.Value(state.index));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rippleAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));

  // Update active tab when navigation state changes
  useEffect(() => {
    setActiveTab(state.routes[state.index].key);
    Animated.timing(floatingButtonAnim, {
      toValue: state.index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state.index, state.routes]);

  const getActiveTabIndex = () => {
    return state.index;
  };

  const handleTabPress = (route: string, index: number) => {
    const isFocused = state.index === index;
    
    const event = navigation.emit({
      type: 'tabPress',
      target: route,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Haptic feedback
      if (Platform.OS === 'android') {
        Vibration.vibrate(50);
      }
      
      // Navigate to the tab
      navigation.navigate(state.routes[index].name);
      
      // Animations
      Animated.parallel([
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
        {/* Upside-down ripple effect */}
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
        const isActive = state.index === index;
        const iconName = isActive ? (tab.activeIcon || tab.icon) : tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => handleTabPress(tab.key, index)}
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
                    color: isActive ? '#000000' : theme.textSecondary,
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
    borderRadius: 28, // Keep base radius for smooth edges
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    // Create upside-down ripple shape using border radius
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  rippleEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28, // Keep base radius for smooth edges
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    // Create upside-down ripple shape using border radius
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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