import { useState, useEffect } from "react";
import AppBlockBridge from "../NativeComponents/AppBlockBridge";
import AppBlockRepo from "../Repos/AppBlockRepo";
import AppBlockLogic from "../Logic/AppBlockLogic";

export default function ViewModelAppBlock() {
  const [selectedApps, setSelectedApps] = useState([]);
  const [availableApps, setAvailableApps] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState(false);
  const [blockingState, setBlockingState] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [savedPackagesCount, setSavedPackagesCount] = useState(0);

  useEffect(() => {
    initializeAppBlockScreen();
  }, []);

  async function initializeAppBlockScreen() {
    await AppBlockRepo.init();
    await checkPermissions();
    await loadInstalledApps();
    await loadSavedBlockedApps();
    await refreshAppBlockState();
  }

  function buildAppsFromSavedPackages(packageNames, installedApps) {
    return packageNames.map((packageName) => {
      const matchingApp = installedApps.find(
        (app) => app.packageName === packageName
      );

      if (matchingApp) {
        return matchingApp;
      }

      return {
        appName: packageName,
        packageName: packageName,
      };
    });
  }

  async function loadInstalledApps() {
    const result = await AppBlockBridge.getInstalledAppsFromNative();

    if (result.nativeResponse && result.nativeResponse.length > 0) {
      setAvailableApps(result.nativeResponse);
      setStatusMessage(result.bridgeStatusMessage);
      return result.nativeResponse;
    } else {
      setAvailableApps([]);
      setStatusMessage("No installed apps found.");
      return [];
    }
  }

  async function loadSavedBlockedApps(installedAppsFromCall = null) {
    const savedPackageNames = await AppBlockRepo.getBlockedApps();
    const count = await AppBlockRepo.countBlockedApps();

    const installedApps = installedAppsFromCall || availableApps;
    const savedSelectedApps = buildAppsFromSavedPackages(
      savedPackageNames,
      installedApps
    );

    setSelectedApps(savedSelectedApps);
    setSavedPackagesCount(count);

    return savedSelectedApps;
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
    setStatusMessage(app.appName + " removed. Press Save Blocked Apps to update SQLite.");
  }

  async function saveBlockedApps() {
    if (selectedApps.length === 0) {
      await AppBlockRepo.clearBlockedApps();
      await AppBlockBridge.syncBlockedApps([]);
      setSavedPackagesCount(0);
      setStatusMessage("No apps selected. SQLite blocked apps list was cleared.");
      return;
    }

    const preparedResult = AppBlockLogic.prepareBlockList(selectedApps);

    if (preparedResult.blockList.length === 0) {
      setStatusMessage(preparedResult.logicStatusMessage);
      return;
    }

    const savedPackageNames = await AppBlockRepo.updateBlockedApps(
      preparedResult.packageNames
    );

    const syncResult = await AppBlockBridge.syncBlockedApps(
      preparedResult.blockList
    );

    setSavedPackagesCount(savedPackageNames.length);
    setStatusMessage(
      "Saved " +
        savedPackageNames.length +
        " blocked app package(s) to SQLite. " +
        syncResult.bridgeStatusMessage
    );
  }

  async function startBlocking() {
    const savedPackageNames = await AppBlockRepo.getBlockedApps();

    if (savedPackageNames.length === 0) {
      setStatusMessage("Save at least one blocked app before starting blocking.");
      return;
    }

    const appsToBlock = buildAppsFromSavedPackages(savedPackageNames, availableApps);
    const preparedResult = AppBlockLogic.prepareBlockList(appsToBlock);

    if (preparedResult.blockList.length === 0) {
      setStatusMessage(preparedResult.logicStatusMessage);
      return;
    }

    const syncResult = await AppBlockBridge.syncBlockedApps(
      preparedResult.blockList
    );

    if (!syncResult.nativeResponse) {
      setStatusMessage(syncResult.bridgeStatusMessage);
      return;
    }

    const startResult = await AppBlockBridge.startNativeBlocking();

    if (startResult.nativeResponse) {
      setPermissionStatus(startResult.nativeResponse.permissionStatus);
      setBlockingState(startResult.nativeResponse.nativeBlockingState);
      await AppBlockRepo.setBlockingState(
        startResult.nativeResponse.nativeBlockingState
      );
    }

    setSelectedApps(appsToBlock);
    setStatusMessage(startResult.bridgeStatusMessage);
  }

  async function stopBlocking() {
    const result = await AppBlockBridge.stopNativeBlocking();

    if (result.nativeResponse) {
      setBlockingState(result.nativeResponse.nativeBlockingState);
      await AppBlockRepo.setBlockingState(result.nativeResponse.nativeBlockingState);
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
    const repoBlockingState = await AppBlockRepo.getBlockingState();

    if (result.nativeResponse) {
      setPermissionStatus(result.nativeResponse.permissionStatus);
      setBlockingState(result.nativeResponse.nativeBlockingState);
      await AppBlockRepo.setBlockingState(result.nativeResponse.nativeBlockingState);
    } else {
      setBlockingState(repoBlockingState);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function monitorForegroundApp() {
    const savedPackageNames = await AppBlockRepo.getBlockedApps();
    const appsToBlock = buildAppsFromSavedPackages(savedPackageNames, availableApps);

    if (appsToBlock.length > 0) {
      await AppBlockBridge.syncBlockedApps(appsToBlock);
    }

    const result = await AppBlockBridge.monitorNativeForegroundApp();

    if (result.nativeResponse) {
      setBlockingState(result.nativeResponse.nativeBlockingState);
    }

    setStatusMessage(result.bridgeStatusMessage);
  }

  async function clearBlockedApps() {
    const wasCleared = await AppBlockRepo.clearBlockedApps();
    await AppBlockBridge.syncBlockedApps([]);

    if (wasCleared) {
      AppBlockLogic.clearBlockedApps();
      setSelectedApps([]);
      setSavedPackagesCount(0);
      setBlockingState(false);
      setStatusMessage("Blocked apps cleared from SQLite.");
    } else {
      setStatusMessage("Could not clear blocked apps from SQLite.");
    }
  }

  return {
    selectedApps,
    availableApps,
    permissionStatus,
    blockingState,
    statusMessage,
    savedPackagesCount,

    initializeAppBlockScreen,
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
  };
}