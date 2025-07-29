import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from './theme-provider';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const { theme } = useTheme();
  const [pressAnim] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
      Animated.timing(pressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      setIsPressed(false);
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 24,
      minWidth: fullWidth ? '100%' : undefined,
    };

    // Variant styles
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.textTertiary : theme.accentPrimary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.textTertiary : theme.surfaceColor,
          borderWidth: 1,
          borderColor: theme.borderColor,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.textTertiary : theme.accentPrimary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    // Variant text styles
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: disabled ? theme.textSecondary : theme.textPrimary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: disabled ? theme.textSecondary : theme.textPrimary,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: disabled ? theme.textTertiary : theme.accentPrimary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? theme.textTertiary : theme.accentPrimary,
        };
      default:
        return baseStyle;
    }
  };

  const getPressStyle = (): ViewStyle => {
    if (!isPressed) return {};

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.accentPrimary + '80', // Semi-transparent
        };
      case 'secondary':
        return {
          backgroundColor: theme.surfaceColor + '80',
        };
      case 'outline':
        return {
          backgroundColor: theme.accentPrimary + '20',
        };
      case 'ghost':
        return {
          backgroundColor: theme.accentPrimary + '20',
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pressAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle(),
          getPressStyle(),
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1} // We handle the press effect manually
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === 'primary'
                ? theme.textPrimary
                : variant === 'outline' || variant === 'ghost'
                ? theme.accentPrimary
                : theme.textPrimary
            }
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Text style={[styles.icon, { color: getTextStyle().color }]}>
                {icon}
              </Text>
            )}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Text style={[styles.icon, { color: getTextStyle().color }]}>
                {icon}
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Base styles are applied dynamically
  },
  icon: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default CustomButton; 