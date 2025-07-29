import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from './theme-provider';
import Typography from './Typography';

const { width } = Dimensions.get('window');

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  scrollY?: Animated.Value;
  showShrinkingEffect?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  rightAction,
  scrollY,
  showShrinkingEffect = false,
}) => {
  const { theme } = useTheme();

  // Create animated values for scroll-linked effects
  const titleScale = scrollY?.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  }) || new Animated.Value(1);

  const titleOpacity = scrollY?.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  }) || new Animated.Value(1);

  const headerHeight = scrollY?.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 60],
    extrapolate: 'clamp',
  }) || new Animated.Value(80);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor,
          borderBottomColor: theme.borderColor,
          height: headerHeight,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.backgroundColor}
        translucent={false}
      />
      
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight },
              ]}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section - Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ scale: titleScale }],
            },
          ]}
        >
          <Typography
            variant="h4"
            weight="bold"
            align="center"
            style={[styles.title, { color: theme.textPrimary }]}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              align="center"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              {subtitle}
            </Typography>
          )}
        </Animated.View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightAction ? (
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight },
              ]}
              onPress={rightAction.onPress}
              activeOpacity={0.7}
            >
              <Icon name={rightAction.icon} size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  leftSection: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightSection: {
    width: 44,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    marginTop: 0,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});

export default HeaderBar; 