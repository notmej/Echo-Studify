import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";

import ViewModelAppBlock from "../ViewModels/ViewModelAppBlock";

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
  danger: "#C77972",
  overlay: "rgba(4, 18, 13, 0.55)",
};

export default function ViewAppBlock({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedApps,
    availableApps,
    permissionStatus,
    blockingState,
    statusMessage,
    savedPackagesCount,

    loadInstalledApps,
    loadSavedBlockedApps,
    selectApp,
    deselectApp,
    saveBlockedApps,
    startBlocking,
    stopBlocking,
    checkPermissions,
    openPermissionSettings,
    refreshAppBlockState,
    monitorForegroundApp,
    clearBlockedApps,
  } = ViewModelAppBlock();

  function onSearchApps(text) {
    setSearchQuery(text);
  }

  async function refreshDisplay() {
    setSearchQuery("");
    const installedApps = await loadInstalledApps();
    await loadSavedBlockedApps(installedApps);
    await refreshAppBlockState();
  }

  function isAppSelected(app) {
    return selectedApps.some(
      (selectedApp) => selectedApp.packageName === app.packageName,
    );
  }

  function handleGoBack() {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.("Home");
    }
  }

  const filteredApps = availableApps.filter((app) =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ImageBackground
      source={require("../../assets/25_00.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      <View style={styles.backgroundOverlay}>
        {/* COMPACT HEADER */}
        <View style={styles.headerArea}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
            >
              <Text style={styles.backArrow}>↶</Text>
            </TouchableOpacity>

            <View style={styles.headerBrand}>
              <Text style={styles.brandText}>
                Studify<Text style={styles.brandDot}>.</Text>
              </Text>

              <Text style={styles.brandSubtitle}>YOUR STUDY SPACE</Text>
            </View>
          </View>

          <Text style={styles.eyebrow}>FOCUS CONTROL</Text>

          <View style={styles.titleRow}>
            <Text style={styles.header} numberOfLines={1} adjustsFontSizeToFit>
              App Blocking
            </Text>

            {/* TINY PERMISSION STATUS */}
            <TouchableOpacity
              style={[
                styles.permissionPill,
                permissionStatus
                  ? styles.permissionPillEnabled
                  : styles.permissionPillDisabled,
              ]}
              onPress={permissionStatus ? undefined : openPermissionSettings}
              disabled={!!permissionStatus}
              accessibilityRole="button"
              accessibilityLabel={
                permissionStatus
                  ? "Accessibility permission enabled"
                  : "Enable Accessibility permission"
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.permissionDot,
                  {
                    backgroundColor: permissionStatus ? "#85CAA0" : theme.gold,
                  },
                ]}
              />

              <Text
                style={[
                  styles.permissionPillText,
                  !permissionStatus && styles.permissionPillTextDisabled,
                ]}
              >
                {permissionStatus ? "Ready" : "Enable Access"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerSubtitle}>
            Keep distractions away while you focus.
          </Text>
        </View>

        <View style={styles.container}>
          {/* INSTALLED APPS HEADER */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>YOUR APPLICATIONS</Text>

              <Text style={styles.sectionTitle}>Installed Apps</Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{availableApps.length}</Text>
            </View>
          </View>

          {/* SEARCH */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⌕</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search installed apps..."
              placeholderTextColor={theme.muted}
              value={searchQuery}
              onChangeText={onSearchApps}
              autoCapitalize="none"
            />
          </View>

          {/* APPS LIST */}
          <View style={styles.appListContainer}>
            <FlatList
              data={filteredApps}
              keyExtractor={(item) => item.packageName}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No applications found</Text>

                  <Text style={styles.emptyDescription}>
                    Try searching for another app.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const selected = isAppSelected(item);

                return (
                  <View
                    style={[styles.appItem, selected && styles.appItemSelected]}
                  >
                    <View style={styles.appTextContainer}>
                      <View style={styles.appNameRow}>
                        {selected && <View style={styles.selectedDot} />}

                        <Text
                          style={styles.appName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.appName}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        selected ? styles.deselectButton : styles.addButton,
                      ]}
                      onPress={() =>
                        selected ? deselectApp(item) : selectApp(item)
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          selected && styles.deselectButtonText,
                        ]}
                      >
                        {selected ? "Remove" : "Select"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          {/* SELECTED APPS / ACTIONS */}
          <View style={styles.bottomPanel}>
            <View style={styles.selectionSummary}>
              <View>
                <Text style={styles.summaryEyebrow}>BLOCKING SELECTION</Text>

                <Text style={styles.summaryTitle}>Selected Apps</Text>
              </View>

              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>
                  {selectedApps.length}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveBlockedApps}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Blocked Apps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearBlockedApps}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear Blocked Apps</Text>
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
    backgroundColor: theme.background,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
  },

  // COMPACT HEADER
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 43,
    paddingBottom: 17,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.gold,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  backArrow: {
    fontSize: 37,
    fontWeight: "400",
    color: theme.gold,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    transform: [
      { rotate: "90deg" }, // Rotate clockwise
      { translateY: -9 }, // Adjust position
    ],
  },

  headerBrand: {
    marginLeft: 15,
  },

  brandText: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: theme.ivory,
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

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.gold,
    marginBottom: 6,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  header: {
    flexShrink: 1,
    fontSize: 27,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -0.6,
  },

  headerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.muted,
    marginTop: 5,
  },

  // SMALL PERMISSION PILL
  permissionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1,
  },

  permissionPillEnabled: {
    backgroundColor: "#1B4435",
    borderColor: "#38785A",
  },

  permissionPillDisabled: {
    backgroundColor: "#403A29",
    borderColor: theme.gold,
  },

  permissionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  permissionPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A5D8B8",
  },

  permissionPillTextDisabled: {
    color: theme.gold,
  },

  // MAIN CONTENT
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  sectionEyebrow: {
    color: theme.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: theme.ivory,
    letterSpacing: -0.4,
  },

  countBadge: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.outline,
    minWidth: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },

  countBadgeText: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  // SEARCH
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 12,
    minHeight: 49,
  },

  searchIcon: {
    color: theme.gold,
    fontSize: 25,
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    color: theme.ivory,
    fontSize: 14,
    paddingVertical: 10,
  },

  // APP LIST
  appListContainer: {
    flex: 1,
    minHeight: 0,
    marginBottom: 10,
  },

  listContent: {
    paddingBottom: 10,
  },

  appItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 8,
  },

  appItemSelected: {
    backgroundColor: theme.surfaceSelected,
    borderColor: theme.gold,
  },

  appTextContainer: {
    flex: 1,
    marginRight: 12,
  },

  appNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  appName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.ivory,
    flexShrink: 1,
  },

  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.gold,
    marginRight: 9,
  },

  // APP ACTIONS
  selectButton: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 10,
    minWidth: 78,
    alignItems: "center",
  },

  addButton: {
    backgroundColor: theme.emerald,
  },

  deselectButton: {
    backgroundColor: theme.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.gold,
  },

  buttonText: {
    color: theme.ivory,
    fontWeight: "700",
    fontSize: 12,
  },

  deselectButtonText: {
    color: theme.gold,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  emptyTitle: {
    color: theme.ivory,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },

  emptyDescription: {
    color: theme.muted,
    fontSize: 13,
    textAlign: "center",
  },

  // COMPACT BOTTOM PANEL
  bottomPanel: {
    backgroundColor: theme.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  selectionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.gold,
    letterSpacing: 1.4,
    marginBottom: 4,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.ivory,
  },

  selectedCount: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 10,
    minWidth: 36,
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.outline,
  },

  selectedCountText: {
    color: theme.gold,
    fontWeight: "800",
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: theme.emerald,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButtonText: {
    color: theme.ivory,
    fontWeight: "700",
    fontSize: 14,
  },

  clearButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.outline,
    alignItems: "center",
    marginTop: 8,
  },

  clearButtonText: {
    color: theme.muted,
    fontWeight: "600",
    fontSize: 13,
  },
});
