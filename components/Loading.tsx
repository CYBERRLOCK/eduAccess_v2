import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from './theme-provider';

const { width } = Dimensions.get('window');

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'spinner',
  fullScreen = false,
}) => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [spinAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [dotAnim1] = useState(new Animated.Value(0));
  const [dotAnim2] = useState(new Animated.Value(0));
  const [dotAnim3] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Spinner animation
    if (variant === 'spinner') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }

    // Pulse animation
    if (variant === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Dots animation
    if (variant === 'dots') {
      const createDotAnimation = (dotAnim: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dotAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dotAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      createDotAnimation(dotAnim1, 0);
      createDotAnimation(dotAnim2, 200);
      createDotAnimation(dotAnim3, 400);
    }
  }, [variant]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return { spinner: 20, text: 14 };
      case 'large':
        return { spinner: 48, text: 18 };
      default:
        return { spinner: 32, text: 16 };
    }
  };

  const renderSpinner = () => {
    const spinnerSize = getSize().spinner;
    const spin = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderWidth: spinnerSize / 8,
            borderColor: theme.accentPrimary + '20',
            borderTopColor: theme.accentPrimary,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    );
  };

  const renderDots = () => {
    const dotSize = getSize().spinner / 4;
    
    return (
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: theme.accentPrimary,
              opacity: dotAnim1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: theme.accentPrimary,
              opacity: dotAnim2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: theme.accentPrimary,
              opacity: dotAnim3,
            },
          ]}
        />
      </View>
    );
  };

  const renderPulse = () => {
    const pulseSize = getSize().spinner;
    
    return (
      <Animated.View
        style={[
          styles.pulse,
          {
            width: pulseSize,
            height: pulseSize,
            backgroundColor: theme.accentPrimary,
            opacity: pulseAnim,
          },
        ]}
      />
    );
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const containerStyle = fullScreen
    ? [styles.fullScreenContainer, { backgroundColor: theme.backgroundColor }]
    : styles.container;

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        {renderLoader()}
        {message && (
          <Text
            style={[
              styles.message,
              {
                color: theme.textSecondary,
                fontSize: getSize().text,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 50,
  },
  pulse: {
    borderRadius: 50,
  },
  message: {
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Loading; 