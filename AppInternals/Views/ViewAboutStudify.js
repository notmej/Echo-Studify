import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";

const WEBSITE_URL = "https://zetiee.site/EchogritStudio/Studify";

const theme = {
  background: "#091B15",
  surface: "#102820",
  raised: "#19362C",
  emerald: "#28765A",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  gold: "#C3A777",
  outline: "#315143",
  overlay: "rgba(4, 18, 13, 0.8)",
};

export default function ViewAboutStudify({ navigation }) {
  async function openWebsite() {
    try {
      await Linking.openURL(WEBSITE_URL);
    } catch (error) {
      Alert.alert(
        "Unable to Open Website",
        "Please try opening the Studify website in your browser.",
      );
    }
  }

  function goBack() {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.("Home");
    }
  }

  function InfoCard({ symbol, title, children }) {
    return (
      <View style={styles.infoCard}>
        <View style={styles.cardHeading}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardSymbol}>{symbol}</Text>
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardDescription}>{children}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/25_00.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      <View style={styles.backgroundOverlay}>
        {/* HEADER */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.brandArea}>
            <Text style={styles.brandName}>
              Studify<Text style={styles.brandDot}>.</Text>
            </Text>
            <Text style={styles.brandSubtitle}>YOUR STUDY SPACE</Text>
          </View>

          <View style={styles.helpIcon}>
            <Text style={styles.helpIconText}>?</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* INTRODUCTION */}
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>ABOUT & SUPPORT</Text>

            <Text style={styles.heroTitle}>Focus with purpose.</Text>

            <Text style={styles.heroDescription}>
              Welcome to Studify — a study space designed to help you stay
              organized, manage distractions, and make meaningful progress every
              day.
            </Text>

            <View style={styles.heroDivider} />

            <Text style={styles.heroQuote}>
              Less distraction. More progress.
            </Text>
          </View>

          {/* ABOUT */}
          <Text style={styles.sectionEyebrow}>DISCOVER STUDIFY</Text>
          <Text style={styles.sectionTitle}>Built for better study days</Text>

          <InfoCard symbol="◷" title="Focus Sessions">
            Set aside dedicated study time with focus timers, including
            customizable sessions and Pomodoro-style intervals.
          </InfoCard>

          <InfoCard symbol="☷" title="Task Management">
            Keep your responsibilities organized. Create tasks, track what needs
            attention, and celebrate completed work.
          </InfoCard>

          <InfoCard symbol="▥" title="Your Progress">
            Explore study statistics, monitor completed sessions, and reflect on
            your productivity and consistency.
          </InfoCard>

          <InfoCard symbol="⊘" title="App Blocking">
            Choose distracting Android applications and optionally restrict
            access to them during supported focus sessions.
          </InfoCard>

          {/* ACCESSIBILITY */}
          <Text style={styles.sectionEyebrow}>PERMISSIONS & CONTROL</Text>
          <Text style={styles.sectionTitle}>How App Blocking works</Text>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Accessibility access</Text>

            <Text style={styles.paragraph}>
              Studify uses Android's AccessibilityService API for its optional
              app-blocking feature.
            </Text>

            <Text style={styles.paragraph}>
              When enabled, the service can detect which application is in the
              foreground, including its package identifier. It compares this
              information with the applications you have selected for blocking.
            </Text>

            <Text style={styles.paragraph}>
              During an active blocking session, Studify can redirect you away
              from a selected application to help you maintain focus.
            </Text>

            <Text style={styles.paragraph}>
              Android Accessibility access is sensitive. Accessibility services
              can potentially observe information about other applications and
              their interfaces.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.panelTitle}>You're in control</Text>

            <Text style={styles.paragraph}>
              App blocking is optional. You can use Studify's timers, tasks, and
              statistics without enabling Accessibility access.
            </Text>

            <Text style={styles.paragraph}>
              Before you enable the feature, Studify presents an in-app
              disclosure and asks for your affirmative consent.
            </Text>

            <Text style={styles.paragraph}>
              You must enable the Accessibility service manually through Android
              Settings. You can disable it there whenever you choose.
            </Text>

            <TouchableOpacity
              style={styles.inlineButton}
              onPress={() => navigation.navigate("AppBlock")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Open App Blocking"
            >
              <Text style={styles.inlineButtonText}>Manage App Blocking</Text>
              <Text style={styles.inlineArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* PRIVACY */}
          <Text style={styles.sectionEyebrow}>YOUR INFORMATION</Text>
          <Text style={styles.sectionTitle}>Privacy & transparency</Text>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Understanding your data</Text>

            <Text style={styles.paragraph}>
              Studify uses local application storage to support features such as
              tasks, study sessions, preferences, and selected blocked
              applications.
            </Text>

            <Text style={styles.paragraph}>
              The app-blocking feature requires access to foreground application
              identifiers to determine whether an application matches your
              selected blocking list.
            </Text>

            <Text style={styles.paragraph}>
              Some information may also be affected by Android backup and
              restore settings. The complete privacy policy should explain
              applicable data collection, storage, transmission, retention, and
              deletion practices.
            </Text>

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>Important privacy note</Text>

              <Text style={styles.noticeText}>
                This page provides a feature and permission overview. It is not
                a replacement for Studify's full public privacy policy.
              </Text>
            </View>
          </View>

          {/* SUPPORT */}
          <Text style={styles.sectionEyebrow}>HELP & INFORMATION</Text>
          <Text style={styles.sectionTitle}>Need some help?</Text>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Common questions</Text>

            <Text style={styles.question}>
              Do I have to enable app blocking?
            </Text>
            <Text style={styles.paragraph}>
              No. It's completely optional. You can continue using the rest of
              Studify without Accessibility permission.
            </Text>

            <View style={styles.smallDivider} />

            <Text style={styles.question}>
              Why aren't my selected apps blocked?
            </Text>
            <Text style={styles.paragraph}>
              Make sure Accessibility access is enabled, your blocked-app
              selection is saved, and a supported focus session is active.
            </Text>

            <View style={styles.smallDivider} />

            <Text style={styles.question}>How do I disable app blocking?</Text>
            <Text style={styles.paragraph}>
              End your focus session or disable Studify's Accessibility service
              in Android Settings.
            </Text>

            <View style={styles.smallDivider} />

            <Text style={styles.question}>Where can I learn more?</Text>
            <Text style={styles.paragraph}>
              Visit our website for Studify information and future support
              resources.
            </Text>
          </View>

          {/* WEBSITE */}
          <View style={styles.websiteCard}>
            <Text style={styles.websiteEyebrow}>EXPLORE MORE</Text>

            <Text style={styles.websiteTitle}>Discover Studify online.</Text>

            <Text style={styles.websiteDescription}>
              Learn more about the app, its features, and the project behind it.
            </Text>

            <TouchableOpacity
              style={styles.websiteButton}
              onPress={openWebsite}
              activeOpacity={0.85}
              accessibilityRole="link"
              accessibilityLabel="Visit Studify website"
            >
              <Text style={styles.websiteButtonText}>Visit Our Website</Text>
              <Text style={styles.websiteArrow}>↗</Text>
            </TouchableOpacity>

            <Text style={styles.websiteAddress}>
              zetiee.site/EchogritStudio/Studify
            </Text>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerBrand}>
              Studify<Text style={styles.brandDot}>.</Text>
            </Text>

            <Text style={styles.footerDescription}>
              Your space to focus, organize, and grow.
            </Text>

            <Text style={styles.footerCopyright}>© 2026 Studify</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.background,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    borderColor: theme.outline,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 35,
    color: theme.gold,
    lineHeight: 39,
  },

  brandArea: {
    flex: 1,
    marginLeft: 14,
  },

  brandName: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.ivory,
    letterSpacing: -0.6,
  },

  brandDot: {
    color: theme.gold,
  },

  brandSubtitle: {
    color: theme.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginTop: 3,
  },

  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  helpIconText: {
    color: theme.gold,
    fontSize: 22,
    fontWeight: "700",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 38,
  },

  hero: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.outline,
    padding: 24,
    marginBottom: 30,
  },

  eyebrow: {
    color: theme.gold,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1.7,
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: theme.ivory,
    marginBottom: 13,
  },

  heroDescription: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 23,
  },

  heroDivider: {
    height: 1,
    backgroundColor: theme.outline,
    marginVertical: 20,
  },

  heroQuote: {
    color: theme.gold,
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "italic",
  },

  sectionEyebrow: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 7,
    marginLeft: 4,
  },

  sectionTitle: {
    color: theme.ivory,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 17,
    marginLeft: 4,
  },

  infoCard: {
    backgroundColor: theme.surface,
    borderColor: theme.outline,
    borderWidth: 1,
    borderRadius: 17,
    padding: 17,
    marginBottom: 11,
  },

  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: theme.raised,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardSymbol: {
    color: theme.gold,
    fontSize: 23,
  },

  cardTitle: {
    color: theme.ivory,
    fontSize: 16,
    fontWeight: "700",
  },

  cardDescription: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 21,
  },

  panel: {
    backgroundColor: theme.surface,
    borderColor: theme.outline,
    borderWidth: 1,
    borderRadius: 19,
    padding: 20,
    marginBottom: 30,
  },

  panelTitle: {
    color: theme.ivory,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  paragraph: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: theme.outline,
    marginVertical: 15,
  },

  smallDivider: {
    height: 1,
    backgroundColor: theme.outline,
    marginBottom: 16,
  },

  question: {
    color: theme.ivory,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  notice: {
    backgroundColor: theme.raised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.outline,
    padding: 14,
    marginTop: 6,
  },

  noticeTitle: {
    color: theme.gold,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  noticeText: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 19,
  },

  inlineButton: {
    backgroundColor: theme.raised,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  inlineButtonText: {
    color: theme.ivory,
    fontSize: 13,
    fontWeight: "700",
  },

  inlineArrow: {
    color: theme.gold,
    fontSize: 22,
  },

  websiteCard: {
    backgroundColor: "#193D30",
    borderWidth: 1,
    borderColor: theme.gold,
    borderRadius: 22,
    padding: 23,
    marginBottom: 30,
  },

  websiteEyebrow: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 11,
  },

  websiteTitle: {
    color: theme.ivory,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.6,
  },

  websiteDescription: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 20,
  },

  websiteButton: {
    backgroundColor: theme.emerald,
    borderRadius: 13,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  websiteButtonText: {
    color: theme.ivory,
    fontSize: 14,
    fontWeight: "700",
  },

  websiteArrow: {
    color: theme.ivory,
    fontSize: 18,
    marginLeft: 10,
  },

  websiteAddress: {
    color: theme.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 13,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },

  footerBrand: {
    fontSize: 25,
    color: theme.ivory,
    fontWeight: "800",
  },

  footerDescription: {
    color: theme.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },

  footerCopyright: {
    color: theme.gold,
    fontSize: 11,
    marginTop: 18,
  },
});
