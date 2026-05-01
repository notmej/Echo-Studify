// Views/AppBlockView.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function ViewAppBlock() {
  const [installedAppsList, setInstalledAppsList] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    showInstalledApps();
  }, []);

  function onSearchApps(text) {
    setSearchQuery(text);
  }

  function onSelectApp(app) {
    const alreadySelected = selectedApps.some(
      (selectedApp) => selectedApp.packageName === app.packageName
    );

    if (!alreadySelected) {
      setSelectedApps([...selectedApps, app]);
      showStatusMessage(app.appName + " selected.");
    }
  }

  function onDeselectApp(app) {
    const updatedSelectedApps = selectedApps.filter(
      (selectedApp) => selectedApp.packageName !== app.packageName
    );

    setSelectedApps(updatedSelectedApps);
    showStatusMessage(app.appName + " removed.");
  }

  function onSaveBlockedApps() {
    if (selectedApps.length === 0) {
      showStatusMessage("No apps selected to block.");
      return;
    }

    // Later, this should call the ViewModel / Repository.
    // Example:
    // AppBlockViewModel.saveBlockedApps(selectedApps);

    showStatusMessage("Blocked apps saved successfully.");
  }

  function showInstalledApps() {
    // Temporary sample data.
    // Later, this should come from the native Android module.
    const apps = [
      {
        appName: "Instagram",
        packageName: "com.instagram.android",
      },
      {
        appName: "TikTok",
        packageName: "com.zhiliaoapp.musically",
      },
      {
        appName: "YouTube",
        packageName: "com.google.android.youtube",
      },
      {
        appName: "Snapchat",
        packageName: "com.snapchat.android",
      },
    ];

    setInstalledAppsList(apps);
    setPermissionStatus(true);
    showStatusMessage("Installed apps loaded.");
  }

  function showStatusMessage(message) {
    setStatusMessage(message);
  }

  function refreshDisplay() {
    setSearchQuery("");
    showInstalledApps();
    showStatusMessage("Display refreshed.");
  }

  const filteredApps = installedAppsList.filter((app) =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function isAppSelected(app) {
    return selectedApps.some(
      (selectedApp) => selectedApp.packageName === app.packageName
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Blocking</Text>

      <Text style={styles.permissionText}>
        Permission Status: {permissionStatus ? "Granted" : "Not Granted"}
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search installed apps..."
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
              <View>
                <Text style={styles.appName}>{item.appName}</Text>
                <Text style={styles.packageName}>{item.packageName}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  selected ? styles.deselectButton : styles.addButton,
                ]}
                onPress={() =>
                  selected ? onDeselectApp(item) : onSelectApp(item)
                }
              >
                <Text style={styles.buttonText}>
                  {selected ? "Remove" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Text style={styles.sectionTitle}>
        Selected Apps: {selectedApps.length}
      </Text>

      <TouchableOpacity style={styles.saveButton} onPress={onSaveBlockedApps}>
        <Text style={styles.saveButtonText}>Save Blocked Apps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshButton} onPress={refreshDisplay}>
        <Text style={styles.saveButtonText}>Refresh Display</Text>
      </TouchableOpacity>

      {statusMessage !== "" && (
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  permissionText: {
    fontSize: 15,
    marginBottom: 15,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },

  appItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  appName: {
    fontSize: 16,
    fontWeight: "600",
  },

  packageName: {
    fontSize: 12,
    color: "#666666",
  },

  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  addButton: {
    backgroundColor: "#4CAF50",
  },

  deselectButton: {
    backgroundColor: "#D9534F",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#222222",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  refreshButton: {
    backgroundColor: "#555555",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  statusMessage: {
    marginTop: 15,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
});