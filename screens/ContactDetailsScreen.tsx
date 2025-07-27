import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, TextInput, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import Icon from 'react-native-vector-icons/FontAwesome';
import type { Contact } from "../types";
import PhotoViewer from './PhotoViewer';

const ContactDetails: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { contacts, department } = route.params as { contacts: Contact[], department: string };
  const [visibleContactId, setVisibleContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhotoPress = (photoUrl: string, facultyName: string) => {
    setSelectedPhoto({ url: photoUrl, name: facultyName });
    setPhotoViewerVisible(true);
  };

  const closePhotoViewer = () => {
    setPhotoViewerVisible(false);
    setSelectedPhoto(null);
  };

  const toggleContactInfo = (contactId: string) => {
    setVisibleContactId(visibleContactId === contactId ? null : contactId);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#2c2c2c" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{department}</Text>
            <Text style={styles.subtitle}>Faculty members</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredContacts.map((contact) => (
          <TouchableOpacity key={contact.id} style={styles.contactCard} onPress={() => toggleContactInfo(contact.id)}>
            <View style={styles.contactHeader}>
              <TouchableOpacity 
                style={styles.avatar}
                onPress={() => {
                  const photoUrl = contact.avatar || contact.image_url;
                  if (photoUrl && contact.name) {
                    handlePhotoPress(photoUrl, contact.name);
                  }
                }}
              >
                {contact.avatar || contact.image_url ? (
                  <Image 
                    source={{ uri: contact.avatar || contact.image_url }} 
                    style={styles.avatarInner}
                    onError={(error) => console.log('Image loading error:', error)}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.role}>{contact.role || contact.designation || 'Faculty Member'}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEmail(contact.email)}
                >
                  <Icon name="envelope" size={18} color="#2c2c2c" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCall(contact.phone)}
                >
                  <Icon name="phone" size={18} color="#2c2c2c" />
                </TouchableOpacity>
              </View>
            </View>
            {visibleContactId === contact.id && (
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Icon name="phone" size={16} color="#666" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{contact.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="envelope" size={16} color="#666" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{contact.email}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        {/* Empty container at bottom */}
        <View style={styles.bottomContainer} />
      </ScrollView>

      {/* Photo Viewer Modal */}
      <Modal
        visible={photoViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closePhotoViewer}
      >
        {selectedPhoto && (
          <PhotoViewer
            photoUrl={selectedPhoto.url}
            facultyName={selectedPhoto.name}
            onClose={closePhotoViewer}
          />
        )}
      </Modal>
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
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#f8f1e4",
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#2c2c2c",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    
  },
  contactCard: {
    backgroundColor: "#f3e2c7",
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3e2c7",
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c2c2c",
    lineHeight: 22,
  },
  role: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#2c2c2c",
    lineHeight: 20,
  },
  bottomContainer: {
    height: 60,
  },
});

export default ContactDetails;
