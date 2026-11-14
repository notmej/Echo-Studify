import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

const theme = {
  surface: "#19362C",
  surfaceRaised: "#224237",
  modalSurface: "#102820",
  emerald: "#28765A",
  ivory: "#F3EFE2",
  muted: "#B6C8BE",
  gold: "#C3A777",
  border: "#355247",
};

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
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${showValue(selectedValue)}`}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedValue && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {showValue(selectedValue)}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownBox}>
            <View style={styles.modalHeader}>
              <View style={styles.headerAccent} />
              <Text style={styles.dropdownTitle}>{label}</Text>
              <Text style={styles.dropdownSubtitle}>Select an option</Text>
            </View>

            <ScrollView
              style={styles.dropdownScroll}
              showsVerticalScrollIndicator={false}
            >
              {optionsToShow.map((option) => {
                const selected = (selectedValue || "") === option;
                return (
                  <TouchableOpacity
                    key={option || "empty-option"}
                    style={[
                      styles.dropdownOption,
                      selected && styles.selectedOption,
                    ]}
                    onPress={() => selectValue(option)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selected && styles.selectedOptionText,
                      ]}
                    >
                      {option || "None"}
                    </Text>
                    <View
                      style={[
                        styles.radioOutline,
                        selected && styles.radioSelected,
                      ]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDropdownVisible(false)}
              activeOpacity={0.8}
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
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.ivory,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  dropdownButton: {
    backgroundColor: theme.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    color: theme.ivory,
    fontWeight: "600",
    fontSize: 15,
    flex: 1,
  },
  placeholderText: {
    color: theme.muted,
    fontWeight: "500",
  },
  chevron: {
    color: theme.gold,
    fontSize: 25,
    lineHeight: 24,
    marginLeft: 12,
    marginTop: -5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 12, 9, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dropdownBox: {
    width: "100%",
    maxHeight: "75%",
    backgroundColor: theme.modalSurface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 18,
  },
  headerAccent: {
    width: 32,
    height: 3,
    borderRadius: 3,
    backgroundColor: theme.gold,
    marginBottom: 15,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.ivory,
    textAlign: "center",
  },
  dropdownSubtitle: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 5,
  },
  dropdownScroll: {
    maxHeight: 285,
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 7,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: theme.surfaceRaised,
    borderColor: theme.gold,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: theme.muted,
    fontWeight: "600",
    flex: 1,
  },
  selectedOptionText: {
    color: theme.ivory,
  },
  radioOutline: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.muted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: theme.gold,
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: theme.gold,
  },
  closeButton: {
    backgroundColor: theme.emerald,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    color: theme.ivory,
    fontWeight: "700",
    fontSize: 15,
  },
});
