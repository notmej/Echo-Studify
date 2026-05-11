// usage before implementation
// 1. open app blocking page
// 2. sqlite database is created locally on first opening of this page
// 3. open permission settings
// 4. enable usage access for studify
// 5. go back to studify
// 6. press check permissions
// 7. select youtube or another app
// 8. press save blocked apps
// 9. press start blocking
// 10. leave studify
// 11. open the blocked app
// 12. studify should reopen after around 1 second



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";

import ViewModelAppBlock from "../ViewModels/ViewModelAppBlock";

const color1 = "#c49572";
const color3 = "#876146";
const color4 = "#a76c40";
const color6 = "#f7d9b7";
const brownColor = "#2a1902";
const inputBoxColor = "#F3E4C9";

export default function ViewAppBlock() {
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
      (selectedApp) => selectedApp.packageName === app.packageName
    );
  }

  const filteredApps = availableApps.filter((app) =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.header}>App Blocking</Text>

      <View style={styles.container}>
        <Text style={styles.permissionText}>
          accessibility permission status: {permissionStatus ? "given" : "not given"}
        </Text>
        
        {/* Messages for testing */}
        {/* <Text style={styles.permissionText}>
          Blocking State: {blockingState ? "Active" : "Inactive"}
        </Text>

        <Text style={styles.permissionText}>
          Saved Packages in SQLite: {savedPackagesCount}
        </Text> */}

        <ScrollView
          style={styles.container3}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!permissionStatus && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={openPermissionSettings}
            >
              <Text style={styles.saveButtonText}>Open Permission Settings</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.refreshButton} onPress={checkPermissions}>
            <Text style={styles.saveButtonText}>Check Permissions</Text>
          </TouchableOpacity>
        </ScrollView>

        <TextInput
          style={styles.searchInput}
          placeholder="Search installed apps..."
          placeholderTextColor={brownColor}
          value={searchQuery}
          onChangeText={onSearchApps}
        />

        <Text style={styles.sectionTitle}>Installed Apps</Text>

        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => {
            const selected = isAppSelected(item);

            return (
              <View style={styles.appItem}>
                <View style={styles.appTextContainer}>
                  <Text
                    style={styles.appName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.appName}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selected ? styles.deselectButton : styles.addButton,
                  ]}
                  onPress={() => (selected ? deselectApp(item) : selectApp(item))}
                >
                  <Text style={styles.buttonText}>
                    {selected ? "Remove" : "Select"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <Text style={styles.sectionTitle}>Selected Apps: {selectedApps.length}</Text>

        {/* <ScrollView
          style={styles.container2}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        > */}
          <TouchableOpacity style={styles.saveButton} onPress={saveBlockedApps}>
            <Text style={styles.saveButtonText}>Save Blocked Apps</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.saveButton} onPress={startBlocking}>
            <Text style={styles.saveButtonText}>Start Blocking</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.stopButton} onPress={stopBlocking}>
            <Text style={styles.buttonText}>Stop Blocking</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.stopButton} onPress={clearBlockedApps}>
            <Text style={styles.buttonText}>Clear Blocked Apps</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.refreshButton} onPress={monitorForegroundApp}>
            <Text style={styles.saveButtonText}>Test Foreground App</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.refreshButton} onPress={refreshDisplay}>
            <Text style={styles.saveButtonText}>Refresh Display</Text>
          </TouchableOpacity> */}

            {/* MESSAGE FOR TESTING  */}
          {/* {statusMessage !== "" && (
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          )} */}
        {/* </ScrollView> */}
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
    padding: 20,
    backgroundColor: "transparent",
  },

  container2: {
    height: 200,
    backgroundColor: "transparent",
  },

  container3: {
    height: 200,
    backgroundColor: "transparent",
  },

  scrollContent: {
    paddingBottom: 10,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 35,
    marginBottom: 10,
    color: brownColor,
  },

  permissionText: {
    fontSize: 15,
    color: brownColor,
    fontWeight: "600",
    backgroundColor: "transparent",
    padding: 6,
    overflow: "hidden",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: color1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: inputBoxColor,
    color: brownColor,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: brownColor,
  },

  appItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 10,
    margin: 5,

    borderWidth: 1,
    borderColor: color1,
    backgroundColor: inputBoxColor,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  appTextContainer: {
    flex: 1,
    marginRight: 10,
  },

  appName: {
    fontSize: 16,
    fontWeight: "600",
    color: brownColor,
  },

  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  addButton: {
    backgroundColor: color3,
  },

  deselectButton: {
    backgroundColor: color1,
  },

  buttonText: {
    color: color6,
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: color3,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  refreshButton: {
    backgroundColor: inputBoxColor,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: color1,
  },

  permissionButton: {
    backgroundColor: color1,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: "center",
  },

  stopButton: {
    backgroundColor: color3,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: brownColor,
    fontWeight: "bold",
    fontSize: 16,
  },

  darkButtonText: {
    color: color6,
    fontWeight: "bold",
    fontSize: 16,
  },

  statusMessage: {
    marginTop: 15,
    fontSize: 14,
    color: brownColor,
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: inputBoxColor,
    padding: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
});