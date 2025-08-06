import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';
import { useUser } from '../contexts/UserContext';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { theme } = useTheme();
  const { isAuthenticated } = useUser();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Navigate based on authentication status after 2.5 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('LoginPage');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image
          source={{ uri: 'https://i.postimg.cc/JsRJXTkP/Main-Logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: theme.textPrimary }]}>EduAccess</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>Simplifying Campus Resources</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default SplashScreen;