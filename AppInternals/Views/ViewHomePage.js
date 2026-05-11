import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

import ViewModelHomePage from "../ViewModels/ViewModelHomepage";
import TimerModeSelectionComponent from "../Components/TimerModeSelectionComponent";

const color1 = "#c49572";
const color3 = "#876146";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

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
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.logoText}>Studify</Text>
          <Text style={styles.heading}>Home</Text>

          <TouchableOpacity style={styles.userIcon}>
            <Text style={styles.userIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.optionButton}
            onPress={goToModeSelection}
          >
            <Text style={styles.optionLabel}>Timer Mode</Text>
            <Text style={styles.optionValue}>
              {selectedMode?.modeName || "No mode selected"}
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

          <View style={styles.timerCard}>
            <Text style={styles.phaseText}>{showTimerPhase()}</Text>
            <Text style={styles.timerText}>{showTimer()}</Text>
          </View>

          {!isTimerRunning ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartSession}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={onStopSession}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Sessions</Text>
              <Text style={styles.infoValue}>{showSessionCount()}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Streak</Text>
              <Text style={styles.infoValue}>{showStreak()} days</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={goToAppBlockSelection}
          >
            <Text style={styles.optionLabel}>Blocked Apps</Text>
            <Text style={styles.optionValue}>
              {selectedBlockedApps.length > 0
                ? selectedBlockedApps.join(", ")
                : "Open app blocking page"}
            </Text>
          </TouchableOpacity>

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{showStatusMessage()}</Text>
          </View>
        </ScrollView>

        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("ToDo")}
          >
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Stats")}
          >
            <Text style={styles.navText}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AppBlock")}
          >
            <Text style={styles.navText}>App Blocking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: brownColor,
  },

  userIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: color1,
    justifyContent: "center",
    alignItems: "center",
  },

  userIconText: {
    fontSize: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  contentScroll: {
    paddingBottom: 120,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: brownColor,
    marginRight: 35,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  optionButton: {
    backgroundColor: color3,
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
  },

  optionLabel: {
    fontSize: 14,
    color: color6,
    marginBottom: 5,
  },

  optionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: color6,
  },

  timerCard: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: color1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  phaseText: {
    fontSize: 17,
    fontWeight: "700",
    color: brownColor,
    marginBottom: 8,
  },

  timerText: {
    fontSize: 42,
    fontWeight: "bold",
    color: brownColor,
  },

  startButton: {
    backgroundColor: color3,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },

  stopButton: {
    backgroundColor: color6,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: brownColor,
    fontSize: 18,
    fontWeight: "bold",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  infoCard: {
    width: "48%",
    backgroundColor: color1,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  infoTitle: {
    fontSize: 16,
    color: "#040607",
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: brownColor,
  },

  statusBox: {
    marginTop: 10,
    backgroundColor: inputBoxColor,
    padding: 14,
    borderRadius: 14,
  },

  statusText: {
    fontSize: 15,
    color: brownColor,
    textAlign: "center",
    fontWeight: "600",
  },

  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: color3,
    paddingVertical: 20,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  navButton: {
    alignItems: "center",
  },

  navText: {
    fontSize: 14,
    fontWeight: "600",
    color: brownColor,
  },
});