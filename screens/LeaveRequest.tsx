import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  RefreshControl,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../components/theme-provider";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from '@react-native-community/datetimepicker';
import type { RootStackParamList } from "../App";

type LeaveRequestNavigationProp = StackNavigationProp<RootStackParamList, 'LeaveRequest'>;

interface LeaveRequest {
  id: number;
  type: string;
  start: string;
  end: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
  timestamp: string;
}

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Duty Leave",
];

const STATUS_COLORS = {
  Approved: "#4CAF50",
  Pending: "#FFC107",
  Rejected: "#F44336",
};

const mockLeaveRequests: LeaveRequest[] = [
  // Example data
  // { id: 1, type: "Sick Leave", start: "2024-07-01", end: "2024-07-03", status: "Approved", reason: "Fever", timestamp: "2024-06-28 10:30" },
];

const LeaveRequest = () => {
  const navigation = useNavigation<LeaveRequestNavigationProp>();
  const { theme } = useTheme();
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [refreshing, setRefreshing] = useState(false);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const handleApply = () => {
    if (!reason.trim()) return;
    const newRequest: LeaveRequest = {
      id: Date.now(),
      type: leaveType,
      start: startDate.toISOString().slice(0, 10),
      end: endDate.toISOString().slice(0, 10),
      status: "Pending" as const,
      reason,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setReason("");
    setStartDate(new Date());
    setEndDate(new Date());
    setLeaveType(LEAVE_TYPES[0]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
  };

  const renderLeaveCard = ({ item }: { item: LeaveRequest }) => (
    <View style={[styles.card, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}> 
      <View style={styles.cardHeader}>
        <Text style={[styles.cardType, { color: theme.textPrimary }]}>{item.type}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}> 
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={[styles.cardDate, { color: theme.textSecondary }]}> 
        {item.start} to {item.end}
      </Text>
      <Text style={[styles.cardReason, { color: theme.textTertiary }]}>Reason: {item.reason}</Text>
      <Text style={[styles.cardTimestamp, { color: theme.textTertiary }]}>Applied: {item.timestamp}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}> 
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
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Leave Request</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Management</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}
              onPress={onRefresh}
            >
              <Icon name="refresh" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderLight }]}
              onPress={() => navigation.navigate("SettingsPage")}
            >
              <Icon name="cog" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Section 1: Leave Application Form */}
        <View style={[styles.section, { backgroundColor: theme.surfaceColor, shadowColor: theme.shadowColor }]}> 
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Apply for Leave</Text>
          {/* Leave Type Dropdown */}
          <TouchableOpacity
            style={[styles.dropdown, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, { color: theme.textPrimary }]}>{leaveType}</Text>
            <Icon name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          {showTypeDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}> 
              {LEAVE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => { setLeaveType(type); setShowTypeDropdown(false); }}
                >
                  <Text style={[styles.dropdownText, { color: theme.textPrimary }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Date Pickers */}
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.datePicker, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
              onPress={() => setShowStartPicker(true)}
            >
              <Icon name="calendar" size={16} color={theme.textSecondary} />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>Start: {startDate.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePicker, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
              onPress={() => setShowEndPicker(true)}
            >
              <Icon name="calendar" size={16} color={theme.textSecondary} />
              <Text style={[styles.dateText, { color: theme.textPrimary }]}>End: {endDate.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(_, date) => { setShowStartPicker(false); if (date) setStartDate(date); }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(_, date) => { setShowEndPicker(false); if (date) setEndDate(date); }}
            />
          )}
          {/* Reason Field */}
          <TextInput
            style={[styles.reasonInput, { color: theme.textPrimary, backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}
            placeholder="Reason for leave"
            placeholderTextColor={theme.textTertiary}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />
          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.accentSecondary }]}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Apply for Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2: Leave Status Tracker */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 32, marginBottom: 12 }]}>Leave Status Tracker</Text>
        {leaveRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-times-o" size={48} color={theme.textTertiary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No leave requests yet</Text>
          </View>
        ) : (
          <FlatList
            data={leaveRequests}
            keyExtractor={item => item.id.toString()}
            renderItem={renderLeaveCard}
            contentContainerStyle={{ paddingBottom: 32 }}
            style={{ marginBottom: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    lineHeight: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 15,
    marginLeft: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 60,
    marginBottom: 16,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  cardDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardReason: {
    fontSize: 13,
    marginBottom: 2,
  },
  cardTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default LeaveRequest; 