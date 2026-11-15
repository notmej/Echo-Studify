import React, { useEffect, useState } from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ViewHomePage from "./AppInternals/Views/ViewHomePage";
import ViewAppBlock from "./AppInternals/Views/ViewAppBlock";
import ViewToDoDashboard from "./AppInternals/Views/ViewToDoDashboard";
import ViewStatisticsDashboard from "./AppInternals/Views/ViewStatisticsDashboard";
import ViewAboutStudify from "./AppInternals/Views/ViewAboutStudify";

const Stack = createNativeStackNavigator();

// Keep disclosure acknowledgement separate from consent.
const DISCLOSURE_SEEN_KEY = "studify_accessibility_disclosure_seen_v2";

const ACCESSIBILITY_CONSENT_KEY = "studify_accessibility_consent_v2";

const theme = {
  background: "#091B15",
  surface: "#102820",
  surfaceRaised: "#19362C",
  emerald: "#28765A",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  gold: "#C3A777",
  outline: "#315143",
};

export default function App() {
  const [showPermissionIntro, setShowPermissionIntro] = useState(false);

  const [isProcessingConsent, setIsProcessingConsent] = useState(false);

  // Allow App Blocking to reopen the same consent disclosure.
  function requestAccessibilityConsent() {
    setShowPermissionIntro(true);
  }

  // Show disclosure on first launch.
  useEffect(() => {
    let mounted = true;

    async function checkFirstLaunch() {
      try {
        const seen = await AsyncStorage.getItem(DISCLOSURE_SEEN_KEY);

        if (mounted && seen !== "true") {
          setShowPermissionIntro(true);
        }
      } catch (error) {
        console.warn("Failed to check accessibility disclosure:", error);

        // Never assume consent when storage fails.
        if (mounted) {
          setShowPermissionIntro(true);
        }
      }
    }

    checkFirstLaunch();

    return () => {
      mounted = false;
    };
  }, []);

  // Declining must not record consent.
  async function handleDeclinePermission() {
    if (isProcessingConsent) return;

    try {
      await AsyncStorage.setItem(DISCLOSURE_SEEN_KEY, "true");

      setShowPermissionIntro(false);
    } catch (error) {
      console.warn("Could not save disclosure acknowledgement:", error);

      // Allow normal app usage even if the user declines.
      setShowPermissionIntro(false);
    }
  }

  // Open Android Accessibility Settings.
  async function openAccessibilitySettings() {
    if (Platform.OS !== "android") {
      Alert.alert(
        "Android Only",
        "This app-blocking feature requires Android.",
      );
      return;
    }

    try {
      await Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
    } catch (error) {
      Alert.alert(
        "Unable to Open Settings",
        "Please open Android Settings > Accessibility and enable the Studify service manually.",
      );
    }
  }

  // Record explicit affirmative consent.
  async function handleEnablePermission() {
    if (isProcessingConsent) return;

    setIsProcessingConsent(true);

    try {
      await AsyncStorage.setItem(ACCESSIBILITY_CONSENT_KEY, "true");

      await AsyncStorage.setItem(DISCLOSURE_SEEN_KEY, "true");

      setShowPermissionIntro(false);

      // Android still requires the user to enable
      // Accessibility access manually.
      await openAccessibilitySettings();
    } catch (error) {
      console.warn("Failed to record accessibility consent:", error);

      Alert.alert(
        "Unable to Save Your Choice",
        "Your consent could not be saved. Please try again.",
      );
    } finally {
      setIsProcessingConsent(false);
    }
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* MAIN NAVIGATION */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={ViewHomePage} />

        {/* Pass the disclosure callback to App Blocking. */}
        <Stack.Screen name="AppBlock">
          {(props) => (
            <ViewAppBlock
              {...props}
              onRequestAccessibilityConsent={requestAccessibilityConsent}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ToDo" component={ViewToDoDashboard} />

        <Stack.Screen name="Stats" component={ViewStatisticsDashboard} />

        <Stack.Screen name="About" component={ViewAboutStudify} />
      </Stack.Navigator>

      {/* ACCESSIBILITY DISCLOSURE */}
      <Modal
        visible={showPermissionIntro}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={handleDeclinePermission}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.permissionCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* TOP HEADER */}
              <View style={styles.modalTopRow}>
                <Text style={styles.eyebrow}>
                  STUDIFY · PRIVACY & PERMISSIONS
                </Text>

                <Text style={styles.stepIndicator}>01 / 01</Text>
              </View>

              {/* ICON */}
              <View style={styles.iconContainer}>
                <Text style={styles.permissionIcon}>✦</Text>
              </View>

              {/* INTRODUCTION */}
              <Text style={styles.title}>Focus with confidence.</Text>

              <Text style={styles.description}>
                Studify offers optional app blocking to help you stay focused
                during study sessions.
              </Text>

              <View style={styles.divider} />

              {/* ACCESSIBILITY DISCLOSURE */}
              <Text style={styles.sectionTitle}>Accessibility access</Text>

              <Text style={styles.description}>
                Studify uses Android's AccessibilityService API to support its
                optional app-blocking feature.
              </Text>

              <Text style={styles.description}>
                When enabled, Studify detects which application is currently
                open, including its application identifier (package name).
              </Text>

              <Text style={styles.description}>
                Studify compares the currently open app against the apps you
                selected for blocking. During a focus session, opening a blocked
                app may cause Studify to redirect you away from it.
              </Text>

              {/* SENSITIVE ACCESS EXPLANATION */}
              <View style={styles.noticeBox}>
                <View style={styles.noticeHeader}>
                  <Text style={styles.noticeIcon}>◇</Text>

                  <Text style={styles.noticeTitle}>Sensitive permission</Text>
                </View>

                <Text style={styles.noticeDescription}>
                  Android Accessibility access is a sensitive permission that
                  can allow a service to observe information about other apps
                  and their interfaces.
                </Text>

                <Text style={styles.noticeDescription}>
                  Studify requests this access specifically to provide its
                  app-blocking functionality.
                </Text>
              </View>

              {/* USER CHOICE */}
              <Text style={styles.sectionTitle}>Your choice</Text>

              <Text style={styles.description}>
                App blocking is optional. You can continue using Studify's other
                features without enabling Accessibility access.
              </Text>

              <Text style={styles.description}>
                You can disable the service at any time through Android
                Settings.
              </Text>

              {/* CONSENT EXPLANATION */}
              <View style={styles.consentBox}>
                <View style={styles.consentHeader}>
                  <Text style={styles.consentIcon}>✓</Text>

                  <Text style={styles.consentTitle}>Your consent matters</Text>
                </View>

                <Text style={styles.consentDescription}>
                  By selecting "I Agree & Continue", you consent to the
                  described use of Accessibility access.
                </Text>

                <Text style={styles.consentDescription}>
                  Android Settings will open so you can manually enable the
                  service. Nothing is enabled automatically.
                </Text>
              </View>

              {/* CONSENT BUTTON */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isProcessingConsent && styles.disabledButton,
                ]}
                onPress={handleEnablePermission}
                disabled={isProcessingConsent}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="I agree and continue to Accessibility settings"
              >
                <Text style={styles.primaryButtonText}>I Agree & Continue</Text>

                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>

              {/* DECLINE BUTTON */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleDeclinePermission}
                disabled={isProcessingConsent}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Not now"
              >
                <Text style={styles.secondaryButtonText}>Not Now</Text>
              </TouchableOpacity>

              <Text style={styles.footerNotice}>
                Accessibility access can be disabled at any time in Android
                Settings.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 12, 9, 0.90)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 35,
  },

  permissionCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    backgroundColor: theme.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: theme.outline,
    overflow: "hidden",
  },

  modalScrollContent: {
    padding: 24,
    paddingBottom: 20,
  },

  modalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  eyebrow: {
    color: theme.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    flexShrink: 1,
    marginRight: 10,
  },

  stepIndicator: {
    color: theme.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  iconContainer: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  permissionIcon: {
    fontSize: 35,
    color: theme.gold,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -0.6,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.ivory,
    marginTop: 9,
    marginBottom: 12,
  },

  description: {
    fontSize: 13,
    color: theme.muted,
    lineHeight: 21,
    marginBottom: 13,
  },

  divider: {
    height: 1,
    backgroundColor: theme.outline,
    marginTop: 9,
    marginBottom: 19,
  },

  noticeBox: {
    backgroundColor: "#28352C",
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#5B6046",
    marginTop: 5,
    marginBottom: 20,
  },

  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  noticeIcon: {
    fontSize: 22,
    color: theme.gold,
    marginRight: 10,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.ivory,
  },

  noticeDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: theme.muted,
    marginBottom: 8,
  },

  consentBox: {
    backgroundColor: theme.surfaceRaised,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.outline,
    marginTop: 7,
    marginBottom: 23,
  },

  consentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  consentIcon: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.gold,
    marginRight: 10,
  },

  consentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.ivory,
  },

  consentDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: theme.muted,
    marginBottom: 8,
  },

  primaryButton: {
    backgroundColor: theme.emerald,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },

  primaryButtonText: {
    color: theme.ivory,
    fontSize: 15,
    fontWeight: "700",
  },

  arrowIcon: {
    color: theme.ivory,
    fontSize: 23,
    marginLeft: 10,
    lineHeight: 24,
  },

  disabledButton: {
    opacity: 0.6,
  },

  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    minHeight: 48,
  },

  secondaryButtonText: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: "600",
  },

  footerNotice: {
    color: theme.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 3,
  },
});
