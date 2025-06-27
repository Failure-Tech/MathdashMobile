import * as Font from "expo-font";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });
};

const LoginScreen = () => {
  const [loadedFont, setLoadedFont] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const termsURL = "https://mathdash.com/terms-and-conditions"
  const privacyURL = "https://mathdash.com/privacy-policy"

  useEffect(() => {
    loadFonts().then(() => setLoadedFont(true));
  }, []);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to Open URL: ", err));
  }

  if (!loadedFont) return null;

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: insets.top + 10, flexGrow: 1 }}
      style={styles.container}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>ma✚hdash</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <Text style={styles.mainText}>🚀 Enter Your Training Portal</Text>
          <Text style={styles.subText}>
            Log in to access your personalized MathDash training journey
          </Text>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TextInput
          placeholder="Enter your email address"
          placeholderTextColor="#cbd5e1"
          style={styles.emailInput}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          We'll never share your info with anyone. See MathDash{" "}
          <Text style={styles.linkText} onPress={() => handleLinkPress(termsURL)}>
            Terms and Conditions
          </Text>{" "}
          and{" "}
          <Text style={styles.linkText} onPress={() => handleLinkPress(privacyURL)}>
            Privacy Policy
          </Text>.
        </Text>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerWrapper: {
    paddingBottom: 10,
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  headerText: {
    fontSize: 28,
    fontFamily: "Manrope-Bold",
    fontWeight: "900",
    color: "white",
    textAlign: "center"
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "column",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  mainText: {
    fontSize: 32,
    fontFamily: "Manrope-Medium",
    color: "white",
    marginBottom: 10,
    textAlign: "center"
  },
  subText: {
    fontSize: 14,
    fontFamily: "Manrope-Light",
    color: "#9ca3af",
    marginBottom: 30,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 30,
  },
  googleButtonText: {
    color: "black",
    fontFamily: "Manrope-Medium",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#4b5563",
  },
  orText: {
    marginHorizontal: 10,
    color: "#9ca3af",
    fontFamily: "Manrope-Regular",
  },
  emailInput: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontFamily: "Manrope-Regular",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "white",
    fontFamily: "Manrope-Medium",
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 10,
    color: "#9ca3af",
    fontFamily: "Manrope-Light",
    textAlign: "center",
    lineHeight: 14,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});

export default LoginScreen;