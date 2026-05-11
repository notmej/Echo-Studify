// AppInternals/Components/TimerModeSelectionComponent.js

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const color1 = "#c49572";
const color3 = "#876146";
const color4 = "#a76c40";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

export default function TimerModeSelectionComponent({
  selectedMode,
  availableModes,
  customDuration,
  pomodoroWorkInterval,
  pomodoroBreakInterval,
  statusMessage,

  selectMode,
  setCustomDuration,
  setPomodoroIntervals,
  saveModeSelection,
  displayAvailableModes,
  resetModeSettings,
}) {
  function isSelected(mode) {
    return selectedMode && selectedMode.modeID === mode.modeID;
  }

  const modesToDisplay = displayAvailableModes
    ? displayAvailableModes()
    : availableModes;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer Mode Selection</Text>

      <FlatList
        data={modesToDisplay}
        keyExtractor={(item) => item.modeID.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.modeCard,
              isSelected(item) ? styles.selectedModeCard : null,
            ]}
            onPress={() => selectMode(item)}
          >
            <Text style={styles.modeName}>{item.modeName}</Text>
            <Text style={styles.modeDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      {(selectedMode?.modeName === "Timer" ||
        selectedMode?.modeName === "Pomodoro") && (
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            {selectedMode?.modeName === "Pomodoro"
              ? "Total Study Duration in Minutes"
              : "Timer Duration in Minutes"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: 25"
            placeholderTextColor={brownColor}
            keyboardType="numeric"
            value={customDuration}
            onChangeText={setCustomDuration}
          />
        </View>
      )}

      {selectedMode?.modeName === "Pomodoro" && (
        <View style={styles.inputSection}>
          <Text style={styles.label}>Pomodoro Work Interval in Minutes</Text>

          <TextInput
            style={styles.input}
            placeholder="Example: 25"
            placeholderTextColor={brownColor}
            keyboardType="numeric"
            value={pomodoroWorkInterval}
            onChangeText={(text) =>
              setPomodoroIntervals(text, pomodoroBreakInterval)
            }
          />

          <Text style={styles.label}>Pomodoro Break Interval in Minutes</Text>

          <TextInput
            style={styles.input}
            placeholder="Example: 5"
            placeholderTextColor={brownColor}
            keyboardType="numeric"
            value={pomodoroBreakInterval}
            onChangeText={(text) =>
              setPomodoroIntervals(pomodoroWorkInterval, text)
            }
          />
        </View>
      )}

      {selectedMode?.modeName === "Stopwatch" && (
        <Text style={styles.helpText}>
          Stopwatch counts up until you stop the session.
        </Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveModeSelection}>
        <Text style={styles.saveButtonText}>Save Mode Selection</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetModeSettings}>
        <Text style={styles.resetButtonText}>Reset Mode Settings</Text>
      </TouchableOpacity>

      {statusMessage !== "" && (
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: color1,
    borderRadius: 18,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: brownColor,
    marginBottom: 15,
    textAlign: "center",
  },

  modeCard: {
    backgroundColor: color3,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: brownColor,
  },

  selectedModeCard: {
    backgroundColor: color4,
  },

  modeName: {
    fontSize: 17,
    fontWeight: "bold",
    color: color6,
  },

  modeDescription: {
    fontSize: 13,
    color: color6,
    marginTop: 4,
  },

  inputSection: {
    marginTop: 5,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: brownColor,
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: brownColor,
    borderRadius: 10,
    padding: 12,
    backgroundColor: inputBoxColor,
    color: brownColor,
  },

  helpText: {
    color: brownColor,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },

  saveButton: {
    backgroundColor: color3,
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  resetButton: {
    backgroundColor: inputBoxColor,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: color6,
    fontWeight: "bold",
    fontSize: 16,
  },

  resetButtonText: {
    color: brownColor,
    fontWeight: "bold",
    fontSize: 16,
  },

  statusMessage: {
    marginTop: 15,
    fontSize: 14,
    color: brownColor,
    textAlign: "center",
    fontWeight: "600",
  },
});