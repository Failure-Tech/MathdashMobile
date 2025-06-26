import * as Font from "expo-font";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });
};

const fakeData = [
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Daily Puzzles",
    smallDescription: "Solved By 1.1m+ People",
    onClick: "puzzles",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Start Lessons",
    smallDescription: "What Is Competition Math",
    onClick: "",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Browse Contests",
    smallDescription: "Continue Your Journey!",
    onClick: "contests",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Coaching Assisstant",
    smallDescription: "Hit up Eric - Chill",
    onClick: "",
  },
  {
    image: require("@/assets/images/arml.png"),
    bigText: "Play 1v1",
    smallDescription: "Play Over 2m+ Competitors Waiting",
    onClick: "play",
  },
];

export default function HomeScreen() {
  const [loadedFont, setLoadedFont] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    loadFonts().then(() => setLoadedFont(true));
  }, []);

  if (!loadedFont) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, { paddingTop: insets.top + 10 }]}> 
        <View style={styles.header}>
          <Icon name="user" size={20} style={styles.profileIcon} />
          <Text style={styles.headerText}>MathDash</Text>
          <Icon name="cog" size={20} style={styles.settingsIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {fakeData.map((item, index) => (
          <View style={styles.card} key={index}>
            <Image source={item.image} style={styles.cardImage} />
            <TouchableOpacity onPress={() => navigation.navigate(item.onClick, {screen: item.onClick})}>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>{item.bigText}</Text>
                <Text style={styles.cardDescription}>{item.smallDescription}</Text>
                <View style={styles.cardFooter}>
                  <Icon name="calendar" size={14} color="gray" />
                  <Text style={styles.cardFooterText}>Event Info</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.buttonView, { bottom: insets.bottom + 70 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("play", {screen: "play"})} style={styles.bottomButton}>
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
  headerWrapper: {
    paddingBottom: 10,
    backgroundColor: "#333333",
  },
  header: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Manrope-Bold",
    color: "white",
  },
  profileIcon: {
    color: "white",
  },
  settingsIcon: {
    color: "white",
  },
  scrollContent: {
    paddingBottom: 200,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    // backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Manrope-Bold",
    marginBottom: 4,
    color: "white",
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: "#D3D3D3",
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardFooterText: {
    fontSize: 12,
    fontFamily: "Manrope-Light",
    color: "gray",
    marginLeft: 4,
  },
  buttonView: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  bottomButton: {
    width: "90%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: {
    fontFamily: "Manrope-Medium",
    color: "white",
    fontSize: 16,
  },
});

// export default HomeScreen;
