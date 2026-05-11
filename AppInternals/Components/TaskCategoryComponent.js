import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

const color1 = "#c49572";
const color3 = "#876146";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

export default function TaskCategoryComponent({
  label,
  selectedValue,
  options,
  onSelectValue,
  placeholder = "Choose an option",
  allowEmpty = true,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const optionsToShow = allowEmpty ? ["", ...(options || [])] : options || [];

  function showValue(value) {
    if (!value) {
      return placeholder;
    }

    return value;
  }

  function selectValue(value) {
    onSelectValue(value);
    setDropdownVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{showValue(selectedValue)}</Text>
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>{label}</Text>

            <ScrollView style={styles.dropdownScroll}>
              {optionsToShow.map((option) => (
                <TouchableOpacity
                  key={option || "empty-option"}
                  style={styles.dropdownOption}
                  onPress={() => selectValue(option)}
                >
                  <Text style={styles.dropdownOptionText}>
                    {option || "None"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDropdownVisible(false)}
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
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: brownColor,
    marginBottom: 5,
  },

  dropdownButton: {
    backgroundColor: inputBoxColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: brownColor,
    padding: 12,
  },

  dropdownButtonText: {
    color: brownColor,
    fontWeight: "700",
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
    maxHeight: "70%",
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
    maxHeight: 260,
  },

  dropdownOption: {
    paddingVertical: 14,
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