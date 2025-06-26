import { auth } from "@/components/config";
import * as Google from "expo-auth-session/providers/google";
import * as Font from "expo-font";
import { useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });
};

export default function LoginScreen() {
  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PlogUBLIC_ANDROID_CLIENT_ID, // Re-enable this
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  // State management
  const [loadedFont, setLoadedFont] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const termsURL = "https://mathdash.com/terms-and-conditions";
  const privacyURL = "https://mathdash.com/privacy-policy";

  // Load fonts
  useEffect(() => {
    loadFonts().then(() => setLoadedFont(true));
  }, []);

  // Handle Google Auth Response
  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn();
    } else if (response?.type === "error") {
      console.error("Google Auth Error:", response.error);
      Alert.alert("Authentication Error", "Failed to authenticate with Google. Please try again.");
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { id_token } = response?.authentication || {};
      
      if (!id_token) {
        throw new Error("No ID token received from Google");
      }

      const credential = GoogleAuthProvider.credential(id_token);
      const result = await signInWithCredential(auth, credential);
      
      console.log("Google sign-in successful:", result.user.email);
      // Navigate to next screen or handle success
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      Alert.alert("Sign In Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isSignUp) {
        // For sign up, you might want to collect password as well
        // This is a simplified version - you should add password input
        Alert.alert("Sign Up", "Please implement password collection for email sign up");
      } else {
        // For sign in, you might want to send a magic link or collect password
        // This is a simplified version
        Alert.alert("Sign In", "Please implement password collection or magic link for email sign in");
      }
      
    } catch (error: any) {
      console.error("Email auth error:", error);
      Alert.alert("Authentication Error", error.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to Open URL: ", err));
  };

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

        <TouchableOpacity 
          style={[styles.googleButton, (!request || isLoading) && styles.disabledButton]} 
          disabled={!request || isLoading} 
          onPress={() => promptAsync()}
        >
          <Text style={styles.googleButtonText}>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Text>
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
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.continueButton, isLoading && styles.disabledButton]} 
          onPress={handleEmailAuth}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? "Processing..." : "Continue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Text>
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
}

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
  disabledButton: {
    opacity: 0.6,
  },
  toggleButton: {
    marginBottom: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#3b82f6",
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    textDecorationLine: "underline",
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