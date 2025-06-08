import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });
};

/* 
    - Bottom NavBar (done)
    - Header displaying [Profile Pic, MathDash, Settings] (done)
    - Play Button Appended at Bottom when scrolling (done)
    - Daily Puzzles
    - Train in Math
    - Contests
    - Coaching assisstant (gives hints for each problem shown)
    - 1v1
*/

const fakeData = [
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Daily Puzzles",
    smallDescription: "Solved By 1.1m+ People",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Start Lessons",
    smallDescription: "What Is Competition Math",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Browse Contests",
    smallDescription: "Continue Your Journey!",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Coaching Assisstant",
    smallDescription: "Hit up Eric - Chill",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Play 1v1",
    smallDescription: "Play Over 2m+ Competitors Waiting",
  },
];

const HomeScreen = () => {
  const [loadedFont, setLoadedFont] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setLoadedFont(true));
  }, []);

  if (!loadedFont) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="user" size={20} style={styles.profileIcon} />
        <Text style={styles.headerText}>MathDash</Text>
        <Icon name="cog" size={20} style={styles.settingsIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {fakeData.map((data, index) => (
          <View key={index} style={styles.cardRow}>
            <Image source={data.image} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardTextArea}>
              <Text style={styles.cardTitle}>{data.bigText}</Text>
              <Text style={styles.cardDescription}>{data.smallDescription}</Text>
              <View style={styles.cardFooter}>
                <Icon name="calendar" size={16} color="#888" />
                <Text style={styles.cardFooterText}>   Updated Today</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Play Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 50,
    backgroundColor: "#D3D3D3",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Manrope-Bold",
    color: "black",
  },
  profileIcon: {
    color: "gray",
  },
  settingsIcon: {
    color: "gray",
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  cardRow: {
    flexDirection: "row",
    backgroundColor: "black",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTextArea: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    marginBottom: 4,
    color: "white",
  },
  cardDescription: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: "#D3D3D3",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  cardFooterText: {
    fontFamily: "Manrope-Light",
    fontSize: 12,
    color: "#777",
  },
  buttonView: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  bottomButton: {
    width: "90%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5DBB63",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: {
    fontFamily: "Manrope-Medium",
    color: "white",
    fontSize: 16,
  },
});

export default HomeScreen;
