import { View, Text, StyleSheet, Image } from "react-native"

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAccess_1-PFNF5kgQ9inxmcEjx7pWfrVqBfRvjb.svg",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>EduAccess</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
})

export default Header

