import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native"
import type { Contact } from "../types"
import { Phone, Mail,Info  } from "./Icons"

interface ContactCardProps {
  contact: Contact
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`)
  }

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`)
  }

  const handleViewDetails = () => {
    // In a real app, this would navigate to a contact details screen
    console.log("View details for:", contact.name)
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handleViewDetails} activeOpacity={0.7}>
      <Image source={{ uri: contact.avatar }} style={styles.avatar} />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.role}>{contact.role}</Text>
        <Text style={styles.department}>{contact.department}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Phone />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <Mail />
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Info />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e9ecef",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  department: {
    fontSize: 14,
    color: "#6c757d",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    marginLeft: 8,
  },
  detailsButton: {
    padding: 8,
    marginLeft: 8,
  },
})

export default ContactCard

