// 1. Open App Blocking page
// 2. Open Permission Settings
// 3. Enable Usage Access for Studify
// 4. Go back to Studify
// 5. Press Check Permissions
// 6. Select YouTube or another app
// 7. Press Save Blocked Apps
// 8. Press Start Blocking
// 9. Leave Studify
// 10. Open the blocked app
// 11. Studify should reopen after around 1 second

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

    loadInstalledApps,
    selectApp,
    deselectApp,
    saveBlockedApps,
    startBlocking,
    stopBlocking,
    checkPermissions,
    openPermissionSettings,
    refreshAppBlockState,
    monitorForegroundApp,
  } = ViewModelAppBlock();

  function onSearchApps(text) {
    setSearchQuery(text);
  }

  function refreshDisplay() {
    setSearchQuery("");
    loadInstalledApps();
    refreshAppBlockState();
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
          Permission Status: {permissionStatus ? "Granted" : "Not Granted"}
        </Text>

        <Text style={styles.permissionText}>
          Blocking State: {blockingState ? "Active" : "Inactive"}
        </Text>

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

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={checkPermissions}
        >
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
                <Text style={styles.appName} numberOfLines={1} ellipsizeMode="tail">
                    {item.appName}
                </Text>

                {/* <Text style={styles.packageName} numberOfLines={2} ellipsizeMode="tail">
                    {item.packageName}
                </Text> */}
                </View>

                <TouchableOpacity
                style={[
                    styles.selectButton,
                    selected ? styles.deselectButton : styles.addButton,
                ]}
                onPress={() =>
                    selected ? deselectApp(item) : selectApp(item)
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

        <ScrollView
        style={styles.container2}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >

        <TouchableOpacity style={styles.saveButton} onPress={saveBlockedApps}>
          <Text style={styles.saveButtonText}>Save Blocked Apps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={startBlocking}>
          <Text style={styles.saveButtonText}>Start Blocking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={stopBlocking}>
          <Text style={styles.buttonText}>Stop Blocking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={monitorForegroundApp}
        >
          <Text style={styles.saveButtonText}>Test Foreground App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={refreshDisplay}>
          <Text style={styles.saveButtonText}>Refresh Display</Text>
        </TouchableOpacity>

        {statusMessage !== "" && (
          <Text style={styles.statusMessage}>{statusMessage}</Text>
        )}
        </ScrollView>
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
        height: 1100,
        backgroundColor: "white",
    },

    container3: {
        height: 110,
        backgroundColor: "white",
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
        marginBottom: 10,
        color: brownColor,
        fontWeight: "600",
    },

    searchInput: {
        borderWidth: 1,
        borderColor: brownColor,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: inputBoxColor,
        color: brownColor,
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
    borderColor: "black",
    backgroundColor: color4,
    borderRadius: 10,
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

    //   packageName: {
    //     fontSize: 12,
    //     color: color6,
    //     marginLeft: 10,
    //   },

    selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    },

    addButton: {
        backgroundColor: "#2f6439",
    },

    deselectButton: {
        backgroundColor: "#48160b",
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
        backgroundColor: color4,
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
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
        backgroundColor: "#48160b",
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

    statusMessage: {
        marginTop: 15,
        fontSize: 14,
        color: brownColor,
        textAlign: "center",
        fontWeight: "600",
    },
});