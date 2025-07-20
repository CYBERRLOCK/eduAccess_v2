import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Phone, Mail } from '../components/Icons'; // Import custom icons
import type { Contact } from "../types";

const ContactDetails: React.FC = () => {
  const route = useRoute();
  const { contacts, department } = route.params as { contacts: Contact[], department: string };
  const [visibleContactId, setVisibleContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const toggleContactInfo = (contactId: string) => {
    setVisibleContactId(visibleContactId === contactId ? null : contactId);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{department}</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredContacts.map((contact) => (
        <TouchableOpacity key={contact.id} style={styles.contactContainer} onPress={() => toggleContactInfo(contact.id)}>
          <View style={styles.contactHeader}>
            <Image source={{ uri: contact.image_url }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{contact.name}</Text>
              <Text style={styles.role}>{contact.designation}</Text>
            </View>
            {visibleContactId === contact.id ? (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Phone: {contact.phone}</Text>
                <Text style={styles.infoLabel}>Email: {contact.email}</Text>
              </View>
            ) : (
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleEmail(contact.email)}>
                  <Mail size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCall(contact.phone)}>
                  <Phone size={24} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#f8f1e4",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f1e4",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    width: '90%',
  },
  contactContainer: {
    marginBottom: 16,
    backgroundColor: "#f3e2c7",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "#6c757d",
  },
  infoLabel: {
    fontSize: 14,
    color: "#212529",
  },
});

export default ContactDetails;
