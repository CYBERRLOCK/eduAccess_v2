import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import supabase from '../supabase'; // Import Supabase client
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../components/theme-provider";
import Icon from 'react-native-vector-icons/FontAwesome';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('uni_announcements')
      .select('*');

    if (error) {
      setError('Error fetching alerts');
      console.error('Error fetching alerts:', error);
    } else {
      setAlerts(data);
    }
    setLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.alertItem, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
      <Text style={[styles.alertTitle, { color: theme.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.alertContent, { color: theme.textSecondary }]}>{item.content}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>University Alerts</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stay updated with announcements</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentPrimary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading alerts...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
  },
  header: {
    height: 120,
    backgroundColor: "#f8f1e4",
    borderBottomWidth: 1,
    borderBottomColor: "#e8d5b5",
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
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c2c2c",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  placeholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  listContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  alertItem: {
    padding: 20,
    backgroundColor: "#f3e2c7",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c2c2c",
  },
  alertContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: 'center',
  },
});

export default Alerts;