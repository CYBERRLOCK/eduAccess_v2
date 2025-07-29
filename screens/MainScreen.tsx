import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import EnhancedBottomNavigator from '../components/EnhancedBottomNavigator';
import HomeScreen from './HomeScreen';
import FacultyDirectory from './FacultyDirectory';
import ProfileScreen from './ProfileScreen';
import NotificationScreen from './NotificationScreen';
import SettingsPage from './SettingsPage';
import type { RootStackParamList } from '../App';
import { useTheme } from '../components/theme-provider';

const MainScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('HomePage');

  useEffect(() => {
    const backAction = () => {
      // If on HomePage, show exit confirmation
      if (currentScreen === 'HomePage') {
        Alert.alert(
          'Exit EduAccess',
          'Do you want to exit EduAccess?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => null,
            },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true;
      } else {
        // If on any other screen, go back to HomePage
        setCurrentScreen('HomePage');
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentScreen]);

  const handleTabPress = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'HomePage':
        return <HomeScreen />;
      case 'FacultyDirectory':
        return <FacultyDirectory />;
      case 'ProfileScreen':
        return <ProfileScreen />;
      case 'NotificationScreen':
        return <NotificationScreen />;
      case 'SettingsPage':
        return <SettingsPage />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      <EnhancedBottomNavigator 
        currentScreen={currentScreen}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainScreen; 