import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";

import ViewModelHomePage from "../ViewModels/ViewModelHomepage";
import TimerModeSelectionComponent from "../Components/TimerModeSelectionComponent";

const theme = {
  background: "#091B15",
  surface: "#102820",
  surfaceRaised: "#19362C",
  surfaceSelected: "#21513F",
  emerald: "#28765A",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  gold: "#C3A777",
  outline: "#315143",
  overlay: "rgba(4, 18, 13, 0.55)",
};

export default function ViewHomePage({ navigation }) {
  const {
    selectedMode,
    availableModes,
    customDuration,
    pomodoroWorkInterval,
    pomodoroBreakInterval,
    statusMessage,

    isTimerRunning,
    selectedBlockedApps,
    modeSelectionVisible,

    selectMode,
    setCustomDuration,
    setPomodoroIntervals,
    saveModeSelection,
    displayAvailableModes,
    resetModeSettings,

    onStartSession,
    onStopSession,
    showTimer,
    showSessionCount,
    showStreak,
    showStatusMessage,
    showTimerPhase,
    goToModeSelection,
    goToAppBlockSelection,
  } = ViewModelHomePage(navigation);

  return (
    <ImageBackground
      source={require("../../assets/25_00.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      <View style={styles.backgroundOverlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.brandEyebrow}>YOUR STUDY SPACE</Text>
              <Text style={styles.logoText}>
                Studify<Text style={styles.logoDot}>.</Text>
              </Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <View style={styles.headerBadgeDot} />
                <Text style={styles.headerBadgeText}>FOCUS</Text>
              </View>

              <TouchableOpacity style={styles.userIcon}>
                <Text style={styles.userIconText}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* WELCOME */}
            <View style={styles.welcomeSection}>
              <Text style={styles.pageEyebrow}>FOCUS DASHBOARD</Text>
              <Text style={styles.pageTitle}>Make today count.</Text>
              <Text style={styles.pageSubtitle}>
                One focused session at a time.
              </Text>
            </View>

            {/* TIMER MODE SELECTOR */}
            <TouchableOpacity
              style={styles.modeSelector}
              onPress={goToModeSelection}
              activeOpacity={0.8}
            >
              <View style={styles.modeSelectorLeft}>
                <View style={styles.modeIconContainer}>
                  <Text style={styles.modeIcon}>◷</Text>
                </View>

                <View style={styles.modeTextContainer}>
                  <Text style={styles.optionLabel}>CURRENT TIMER MODE</Text>

                  <Text style={styles.optionValue}>
                    {selectedMode?.modeName || "Choose a mode"}
                  </Text>
                </View>
              </View>

              <Text style={styles.modeChevron}>
                {modeSelectionVisible ? "⌃" : "⌄"}
              </Text>
            </TouchableOpacity>

            {modeSelectionVisible && (
              <TimerModeSelectionComponent
                selectedMode={selectedMode}
                availableModes={availableModes}
                customDuration={customDuration}
                pomodoroWorkInterval={pomodoroWorkInterval}
                pomodoroBreakInterval={pomodoroBreakInterval}
                statusMessage={statusMessage}
                selectMode={selectMode}
                setCustomDuration={setCustomDuration}
                setPomodoroIntervals={setPomodoroIntervals}
                saveModeSelection={saveModeSelection}
                displayAvailableModes={displayAvailableModes}
                resetModeSettings={resetModeSettings}
              />
            )}

            {/* TIMER SECTION */}
            <View style={styles.timerSection}>
              <View style={styles.timerSectionHeader}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionEyebrow}>FOCUS SESSION</Text>
              </View>

              <View style={styles.timerOuter}>
                <View style={styles.timerMiddle}>
                  <View style={styles.timerInner}>
                    <View style={styles.timerStatusRow}>
                      <View
                        style={[
                          styles.timerStatusDot,
                          isTimerRunning && styles.timerStatusDotActive,
                        ]}
                      />

                      <Text style={styles.phaseText}>{showTimerPhase()}</Text>
                    </View>

                    <Text
                      style={styles.timerText}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {showTimer()}
                    </Text>

                    <View style={styles.timerDivider} />

                    <Text style={styles.timerCaption}>
                      {isTimerRunning
                        ? "STAY IN YOUR FLOW"
                        : "READY WHEN YOU ARE"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* START / STOP */}
              {!isTimerRunning ? (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={onStartSession}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startIcon}>▶</Text>
                  <Text style={styles.startButtonText}>
                    Start Focus Session
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={onStopSession}
                  activeOpacity={0.85}
                >
                  <Text style={styles.stopIcon}>■</Text>
                  <Text style={styles.stopButtonText}>Stop Session</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* STATS */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>YOUR PROGRESS</Text>
                <Text style={styles.sectionTitle}>At a glance</Text>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("Stats")}>
                <Text style={styles.seeAllText}>View stats ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Text style={styles.infoIcon}>◷</Text>
                  <View style={styles.infoAccentDot} />
                </View>

                <Text style={styles.infoValue}>{showSessionCount()}</Text>

                <Text style={styles.infoTitle}>Focus Sessions</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Text style={styles.infoIcon}>✦</Text>
                  <View style={styles.infoAccentDot} />
                </View>

                <View style={styles.streakValueRow}>
                  <Text style={styles.infoValue}>{showStreak()}</Text>
                  <Text style={styles.streakUnit}>days</Text>
                </View>

                <Text style={styles.infoTitle}>Current Streak</Text>
              </View>
            </View>

            {/* APP BLOCKING */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>DISTRACTION CONTROL</Text>
                <Text style={styles.sectionTitle}>Stay focused</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.blockCard}
              onPress={goToAppBlockSelection}
              activeOpacity={0.8}
            >
              <View style={styles.blockIconContainer}>
                <Text style={styles.blockIcon}>⊘</Text>
              </View>

              <View style={styles.blockContent}>
                <Text style={styles.blockTitle}>Blocked Apps</Text>

                <Text style={styles.blockDescription} numberOfLines={2}>
                  {selectedBlockedApps.length > 0
                    ? selectedBlockedApps.join(", ")
                    : "Choose apps to keep distractions away"}
                </Text>

                {selectedBlockedApps.length > 0 && (
                  <Text style={styles.blockCount}>
                    {selectedBlockedApps.length} selected
                  </Text>
                )}
              </View>

              <Text style={styles.blockArrow}>›</Text>
            </TouchableOpacity>

            {/* STATUS MESSAGE */}
            {showStatusMessage() ? (
              <View style={styles.statusBox}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>{showStatusMessage()}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* BOTTOM NAVIGATION */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={[styles.navIcon, styles.navIconActive]}>⌂</Text>
              <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
              <View style={styles.activeIndicator} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("ToDo")}
            >
              <Text style={styles.navIcon}>☷</Text>
              <Text style={styles.navText}>Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Stats")}
            >
              <Text style={styles.navIcon}>▥</Text>
              <Text style={styles.navText}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("AppBlock")}
            >
              <Text style={styles.navIcon}>⊘</Text>
              <Text style={styles.navText}>Blocking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
  },

  container: {
    flex: 1,
  },

  // HEADER
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 18,
  },

  brandEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.gold,
    letterSpacing: 2,
    marginBottom: 5,
  },

  logoText: {
    fontSize: 27,
    fontWeight: "800",
    color: theme.ivory,
    letterSpacing: -0.8,
  },

  logoDot: {
    color: theme.gold,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 12,
  },

  headerBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.gold,
    marginRight: 6,
  },

  headerBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: theme.muted,
  },

  userIcon: {
    width: 41,
    height: 41,
    borderRadius: 21,
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    justifyContent: "center",
    alignItems: "center",
  },

  userIconText: {
    fontSize: 18,
  },

  // CONTENT
  content: {
    flex: 1,
  },

  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  welcomeSection: {
    marginBottom: 26,
    paddingHorizontal: 4,
  },

  pageEyebrow: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 9,
  },

  pageTitle: {
    fontSize: 29,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -0.7,
    marginBottom: 6,
  },

  pageSubtitle: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  // TIMER MODE
  modeSelector: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 19,
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modeSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  modeIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: theme.surfaceSelected,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  modeIcon: {
    color: theme.gold,
    fontSize: 26,
  },

  modeTextContainer: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.muted,
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  optionValue: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.ivory,
  },

  modeChevron: {
    fontSize: 24,
    color: theme.gold,
    marginLeft: 12,
  },

  // TIMER
  timerSection: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 26,
    padding: 20,
    marginBottom: 27,
    alignItems: "center",
  },

  timerSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    alignSelf: "flex-start",
  },

  sectionAccent: {
    width: 19,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.gold,
    marginRight: 9,
  },

  sectionEyebrow: {
    fontSize: 10,
    color: theme.gold,
    fontWeight: "800",
    letterSpacing: 1.6,
  },

  timerOuter: {
    width: 242,
    height: 242,
    borderRadius: 121,
    borderWidth: 2,
    borderColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    backgroundColor: "#142F25",
  },

  timerMiddle: {
    width: 225,
    height: 225,
    borderRadius: 113,
    borderWidth: 1,
    borderColor: theme.outline,
    alignItems: "center",
    justifyContent: "center",
  },

  timerInner: {
    width: 204,
    height: 204,
    borderRadius: 102,
    backgroundColor: theme.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  timerStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  timerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.muted,
    marginRight: 7,
  },

  timerStatusDotActive: {
    backgroundColor: theme.gold,
  },

  phaseText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.muted,
    textAlign: "center",
  },

  timerText: {
    fontSize: 42,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -1.4,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    width: "100%",
  },

  timerDivider: {
    width: 30,
    height: 1,
    backgroundColor: theme.gold,
    opacity: 0.7,
    marginTop: 13,
    marginBottom: 12,
  },

  timerCaption: {
    fontSize: 9,
    color: theme.gold,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // SESSION BUTTONS
  startButton: {
    backgroundColor: theme.emerald,
    borderRadius: 15,
    minHeight: 53,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  startIcon: {
    color: theme.ivory,
    fontSize: 13,
    marginRight: 12,
  },

  startButtonText: {
    color: theme.ivory,
    fontWeight: "700",
    fontSize: 15,
  },

  stopButton: {
    backgroundColor: "#59403B",
    borderWidth: 1,
    borderColor: "#926B62",
    borderRadius: 15,
    minHeight: 53,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  stopIcon: {
    color: "#F3D2C9",
    fontSize: 14,
    marginRight: 12,
  },

  stopButtonText: {
    color: "#F3D2C9",
    fontWeight: "700",
    fontSize: 15,
  },

  // STATS
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontSize: 21,
    color: theme.ivory,
    fontWeight: "700",
    marginTop: 5,
    letterSpacing: -0.4,
  },

  seeAllText: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "600",
    paddingBottom: 3,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  infoCard: {
    width: "48%",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    padding: 19,
    borderRadius: 20,
    minHeight: 135,
  },

  infoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  infoIcon: {
    fontSize: 19,
    color: theme.gold,
  },

  infoAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.emerald,
  },

  infoValue: {
    fontSize: 29,
    fontWeight: "800",
    color: theme.ivory,
    letterSpacing: -0.8,
  },

  infoTitle: {
    fontSize: 12,
    color: theme.muted,
    marginTop: 5,
    fontWeight: "600",
  },

  streakValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  streakUnit: {
    fontSize: 12,
    color: theme.gold,
    fontWeight: "700",
    marginLeft: 6,
  },

  // APP BLOCKING
  blockCard: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 19,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  blockIconContainer: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: theme.surfaceSelected,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  blockIcon: {
    color: theme.gold,
    fontSize: 26,
  },

  blockContent: {
    flex: 1,
  },

  blockTitle: {
    fontSize: 16,
    color: theme.ivory,
    fontWeight: "700",
    marginBottom: 4,
  },

  blockDescription: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 18,
  },

  blockCount: {
    color: theme.gold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },

  blockArrow: {
    color: theme.gold,
    fontSize: 27,
    marginLeft: 10,
  },

  // STATUS
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.gold,
    marginRight: 10,
  },

  statusText: {
    flex: 1,
    fontSize: 13,
    color: theme.muted,
    lineHeight: 19,
    fontWeight: "500",
  },

  // NAVIGATION
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.outline,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 48,
  },

  navIcon: {
    fontSize: 22,
    color: theme.muted,
    marginBottom: 4,
  },

  navIconActive: {
    color: theme.gold,
  },

  navText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.muted,
  },

  navTextActive: {
    color: theme.ivory,
    fontWeight: "800",
  },

  activeIndicator: {
    position: "absolute",
    top: -12,
    width: 24,
    height: 2,
    borderRadius: 2,
    backgroundColor: theme.gold,
  },
});
