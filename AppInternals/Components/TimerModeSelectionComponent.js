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
          <Text style={styles.timePartButtonText}>{formatTwoDigits(value)}</Text>
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
                updateTimeValue(valueInMinutes, "hours", value, onChangeValue)
              )
            }
          />

          <TimePartButton
            label="Minutes"
            value={timeParts.minutes}
            onPress={() =>
              openDropdown("Choose Minutes", minuteOptions, (value) =>
                updateTimeValue(valueInMinutes, "minutes", value, onChangeValue)
              )
            }
          />

          <TimePartButton
            label="Seconds"
            value={timeParts.seconds}
            onPress={() =>
              openDropdown("Choose Seconds", secondOptions, (value) =>
                updateTimeValue(valueInMinutes, "seconds", value, onChangeValue)
              )
            }
          />
        </View>
      </View>
    );
  }

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
        selectedMode?.modeName === "Pomodoro" ||
        selectedMode?.modeName === "Stopwatch") && (
        <TimePickerRow
          label={
            selectedMode?.modeName === "Pomodoro"
              ? "Total Study Duration"
              : selectedMode?.modeName === "Stopwatch"
              ? "Stopwatch Duration"
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
          Stopwatch counts upward until the selected duration is reached.
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

            <TouchableOpacity style={styles.closeButton} onPress={closeDropdown}>
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

  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: inputBoxColor,
    borderWidth: 1,
    borderColor: brownColor,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  pickerColumn: {
    width: "32%",
  },

  pickerLabel: {
    color: brownColor,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 3,
  },

  timePartButton: {
    backgroundColor: color6,
    borderWidth: 1,
    borderColor: brownColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },

  timePartButtonText: {
    color: brownColor,
    fontSize: 16,
    fontWeight: "bold",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  dropdownBox: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: inputBoxColor,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: brownColor,
  },

  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: brownColor,
    textAlign: "center",
    marginBottom: 10,
  },

  dropdownScroll: {
    maxHeight: 320,
  },

  dropdownOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: color1,
    alignItems: "center",
  },

  dropdownOptionText: {
    fontSize: 18,
    color: brownColor,
    fontWeight: "700",
  },

  closeButton: {
    backgroundColor: color3,
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  closeButtonText: {
    color: color6,
    fontWeight: "bold",
    fontSize: 16,
  },
});