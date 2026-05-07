import { useState, useEffect } from "react";
import AppBlockBridge from "../NativeComponents/AppBlockBridge";

export default function ViewModelAppBlock() {
  const [selectedApps, setSelectedApps] = useState([]);
  const [availableApps, setAvailableApps] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState(false);
  const [blockingState, setBlockingState] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    checkPermissions();
    loadInstalledApps();
    refreshAppBlockState();
  }, []);

  async function loadInstalledApps() {
  const result = await AppBlockBridge.getInstalledAppsFromNative();

  if (result.nativeResponse && result.nativeResponse.length > 0) {
    setAvailableApps(result.nativeResponse);
    setStatusMessage(result.bridgeStatusMessage);
  } else {
    setAvailableApps([]);
    setStatusMessage("No installed apps found.");
  }
}

  function selectApp(app) {
    const alreadySelected = selectedApps.some(
      (selectedApp) => selectedApp.packageName === app.packageName
    );

    if (alreadySelected) {
      setStatusMessage(app.appName + " is already selected.");
      return;
    }

    setSelectedApps([...selectedApps, app]);
    setStatusMessage(app.appName + " selected.");
  }

  function deselectApp(app) {
    const updatedApps = selectedApps.filter(
      (selectedApp) => selectedApp.packageName !== app.packageName
    );

    setSelectedApps(updatedApps);
    setStatusMessage(app.appName + " removed.");
  }

  async function saveBlockedApps() {
    if (selectedApps.length === 0) {
      setStatusMessage("No apps selected to block.");
      return;
    }

    const result = await AppBlockBridge.sendBlockedAppsToNative(selectedApps);

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function startBlocking() {
    if (selectedApps.length === 0) {
      setStatusMessage("Select at least one app to block.");
      return;
    }

    const syncResult = await AppBlockBridge.syncBlockedApps(selectedApps);

    if (!syncResult.nativeResponse) {
      setStatusMessage(syncResult.bridgeStatusMessage);
      return;
    }

    const startResult = await AppBlockBridge.startNativeBlocking();

    if (startResult.nativeResponse) {
      setPermissionStatus(startResult.nativeResponse.permissionStatus);
      setBlockingState(startResult.nativeResponse.nativeBlockingState);
    }

    setStatusMessage(startResult.bridgeStatusMessage);
  }

  async function stopBlocking() {
    const result = await AppBlockBridge.stopNativeBlocking();

    if (result.nativeResponse) {
      setBlockingState(result.nativeResponse.nativeBlockingState);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function checkPermissions() {
    const result = await AppBlockBridge.checkNativePermission();

    if (result.nativeResponse) {
      setPermissionStatus(result.nativeResponse.permissionStatus);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function openPermissionSettings() {
    const result = await AppBlockBridge.openNativePermissionSettings();
    setStatusMessage(result.bridgeStatusMessage);
  }

  async function refreshAppBlockState() {
    const result = await AppBlockBridge.getNativeBlockingState();

    if (result.nativeResponse) {
      setPermissionStatus(result.nativeResponse.permissionStatus);
      setBlockingState(result.nativeResponse.nativeBlockingState);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function monitorForegroundApp() {
    const result = await AppBlockBridge.monitorNativeForegroundApp();

    if (result.nativeResponse) {
      setBlockingState(result.nativeResponse.nativeBlockingState);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  return {
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
  };
}