import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";

// Studify — dark emerald design tokens
const theme = {
  surface: "#102820",
  surfaceRaised: "#19362C",
  surfaceSelected: "#21513F",
  emerald: "#28765A",
  emeraldPressed: "#1E6049",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  outline: "#315143",
  gold: "#C3A777",
  modalOverlay: "rgba(2, 12, 9, 0.78)",
};

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownTitle, setDropdownTitle] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownOnSelect, setDropdownOnSelect] = useState(null);

  function isSelected(mode) {
    return selectedMode && selectedMode.modeID === mode.modeID;
  }

  const modesToDisplay = displayAvailableModes
    ? displayAvailableModes()
    : availableModes;

  function createNumberList(start, end) {
    const numbers = [];

    for (let number = start; number <= end; number++) {
      numbers.push(number);
    }

    return numbers;
  }

  const hourOptions = createNumberList(0, 23);
  const minuteOptions = createNumberList(0, 59);
  const secondOptions = createNumberList(0, 59);

  function convertMinutesValueToTotalSeconds(valueInMinutes) {
    const numericValue = Number(valueInMinutes);

    if (Number.isNaN(numericValue) || numericValue <= 0) {
      return 0;
    }

    return Math.round(numericValue * 60);
  }

  function convertTotalSecondsToMinutesValue(totalSeconds) {
    const safeTotalSeconds = Math.max(0, Number(totalSeconds) || 0);
    return String(safeTotalSeconds / 60);
  }

  function getTimeParts(valueInMinutes) {
    const totalSeconds = convertMinutesValueToTotalSeconds(valueInMinutes);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
    };
  }

  function formatTwoDigits(value) {
    return String(value).padStart(2, "0");
  }

  function updateTimeValue(currentValue, changedPart, changedValue, setter) {
    const currentParts = getTimeParts(currentValue);

    const nextParts = {
      ...currentParts,
      [changedPart]: Number(changedValue),
    };

    const totalSeconds =
      nextParts.hours * 3600 + nextParts.minutes * 60 + nextParts.seconds;

    setter(convertTotalSecondsToMinutesValue(totalSeconds));
  }

  function openDropdown(title, options, onSelect) {
    setDropdownTitle(title);
    setDropdownOptions(options);
    setDropdownOnSelect(() => onSelect);
    setDropdownVisible(true);
  }

  function closeDropdown() {
    setDropdownVisible(false);
    setDropdownTitle("");
    setDropdownOptions([]);
    setDropdownOnSelect(null);
  }

  function selectDropdownValue(value) {
    if (dropdownOnSelect) {
      dropdownOnSelect(value);
    }

    closeDropdown();
  }

  function TimePartButton({ label, value, onPress }) {
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{label}</Text>

        <TouchableOpacity style={styles.timePartButton} onPress={onPress}>
          <Text style={styles.timePartButtonText}>
            {formatTwoDigits(value)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function TimePickerRow({ label, valueInMinutes, onChangeValue }) {
    const timeParts = getTimeParts(valueInMinutes);

    return (
      <View style={styles.inputSection}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.timePickerRow}>
          <TimePartButton
            label="Hours"
            value={timeParts.hours}
            onPress={() =>
              openDropdown("Choose Hours", hourOptions, (value) =>
                updateTimeValue(valueInMinutes, "hours", value, onChangeValue),
              )
            }
          />

          <TimePartButton
            label="Minutes"
            value={timeParts.minutes}
            onPress={() =>
              openDropdown("Choose Minutes", minuteOptions, (value) =>
                updateTimeValue(
                  valueInMinutes,
                  "minutes",
                  value,
                  onChangeValue,
                ),
              )
            }
          />

          <TimePartButton
            label="Seconds"
            value={timeParts.seconds}
            onPress={() =>
              openDropdown("Choose Seconds", secondOptions, (value) =>
                updateTimeValue(
                  valueInMinutes,
                  "seconds",
                  value,
                  onChangeValue,
                ),
              )
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>FOCUS SETTINGS</Text>
      <Text style={styles.title}>Choose your timer</Text>
      <Text style={styles.subtitle}>
        Set the rhythm for your next study session.
      </Text>

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
            <View style={styles.modeContent}>
              <Text style={styles.modeName}>{item.modeName}</Text>
              <Text style={styles.modeDescription}>{item.description}</Text>
            </View>
            <View
              style={[
                styles.selectionIndicator,
                isSelected(item) && styles.selectionIndicatorActive,
              ]}
            >
              {isSelected(item) && <Text style={styles.selectionCheck}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}
      />

      {(selectedMode?.modeName === "Timer" ||
        selectedMode?.modeName === "Pomodoro") && (
        <TimePickerRow
          label={
            selectedMode?.modeName === "Pomodoro"
              ? "Total Study Duration"
              : "Timer Duration"
          }
          valueInMinutes={customDuration}
          onChangeValue={setCustomDuration}
        />
      )}

      {selectedMode?.modeName === "Pomodoro" && (
        <View>
          <TimePickerRow
            label="Pomodoro Work Interval"
            valueInMinutes={pomodoroWorkInterval}
            onChangeValue={(value) =>
              setPomodoroIntervals(value, pomodoroBreakInterval)
            }
          />

          <TimePickerRow
            label="Pomodoro Break Interval"
            valueInMinutes={pomodoroBreakInterval}
            onChangeValue={(value) =>
              setPomodoroIntervals(pomodoroWorkInterval, value)
            }
          />
        </View>
      )}

      {selectedMode?.modeName === "Stopwatch" && (
        <Text style={styles.helpText}>
          Stopwatch counts upward indefinitely until you press Stop. Sessions
          under 10 minutes will not increase your session count or streak.
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

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>{dropdownTitle}</Text>

            <ScrollView style={styles.dropdownScroll}>
              {dropdownOptions.map((value) => (
                <TouchableOpacity
                  key={String(value)}
                  style={styles.dropdownOption}
                  onPress={() => selectDropdownValue(value)}
                >
                  <Text style={styles.dropdownOptionText}>
                    {formatTwoDigits(value)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeDropdown}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.surface,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.outline,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.gold,
    letterSpacing: 2.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.ivory,
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 22,
  },
  modeCard: {
    backgroundColor: theme.surfaceRaised,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.outline,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedModeCard: {
    backgroundColor: theme.surfaceSelected,
    borderColor: theme.gold,
    borderWidth: 1.5,
  },
  modeContent: {
    flex: 1,
    paddingRight: 12,
  },
  modeName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.ivory,
  },
  modeDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.muted,
    marginTop: 5,
  },
  selectionIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: theme.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionIndicatorActive: {
    borderColor: theme.gold,
    backgroundColor: theme.gold,
  },
  selectionCheck: {
    color: theme.surface,
    fontWeight: "900",
    fontSize: 13,
    lineHeight: 17,
  },
  inputSection: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.ivory,
    marginTop: 12,
    marginBottom: 10,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  pickerColumn: {
    width: "31%",
  },
  pickerLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  timePartButton: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 11,
    paddingVertical: 12,
    alignItems: "center",
  },
  timePartButtonText: {
    color: theme.ivory,
    fontSize: 20,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  helpText: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "left",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: theme.emerald,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.outline,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: theme.ivory,
    fontWeight: "700",
    fontSize: 15,
  },
  resetButtonText: {
    color: theme.muted,
    fontWeight: "700",
    fontSize: 14,
  },
  statusMessage: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
    color: theme.muted,
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  dropdownBox: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: theme.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.outline,
  },
  dropdownTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.ivory,
    textAlign: "center",
    marginBottom: 14,
  },
  dropdownScroll: {
    maxHeight: 320,
  },
  dropdownOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.outline,
    alignItems: "center",
  },
  dropdownOptionText: {
    fontSize: 18,
    color: theme.ivory,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.outline,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  closeButtonText: {
    color: theme.muted,
    fontWeight: "700",
    fontSize: 15,
  },
});
