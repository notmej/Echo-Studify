import { NativeModules } from "react-native";

const { AppBlockModule } = NativeModules;

let nativeCommand = "";
let nativeResponse = null;
let bridgeStatusMessage = "";

function isNativeModuleAvailable() {
  return AppBlockModule !== null && AppBlockModule !== undefined;
}

async function sendBlockedAppsToNative(blockedApps) {
  nativeCommand = "SEND_BLOCKED_APPS";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  if (!blockedApps || blockedApps.length === 0) {
    bridgeStatusMessage = "No blocked apps to send.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.blockSelectedApps(blockedApps);
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to send blocked apps to native module.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function startNativeBlocking() {
  nativeCommand = "START_NATIVE_BLOCKING";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.startBlockingService();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to start native blocking.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function stopNativeBlocking() {
  nativeCommand = "STOP_NATIVE_BLOCKING";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.stopBlockingService();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to stop native blocking.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function syncBlockedApps(blockedApps) {
  nativeCommand = "SYNC_BLOCKED_APPS";

  const sendResult = await sendBlockedAppsToNative(blockedApps);

  if (!sendResult.nativeResponse) {
    return sendResult;
  }

  bridgeStatusMessage = "Blocked apps synced with native module.";

  return {
    nativeCommand,
    nativeResponse: sendResult.nativeResponse,
    bridgeStatusMessage,
  };
}

async function getNativeBlockingState() {
  nativeCommand = "GET_NATIVE_BLOCKING_STATE";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.getBlockedAppState();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to get native blocking state.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function checkNativePermission() {
  nativeCommand = "CHECK_NATIVE_PERMISSION";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.checkUsageAccessPermission();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to check native permission.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function openNativePermissionSettings() {
  nativeCommand = "OPEN_NATIVE_PERMISSION_SETTINGS";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.openUsageAccessSettings();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to open usage access settings.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function monitorNativeForegroundApp() {
  nativeCommand = "MONITOR_NATIVE_FOREGROUND_APP";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: null,
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.monitorForegroundApp();
    bridgeStatusMessage = nativeResponse.nativeStatusMessage;

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to monitor foreground app.";

    return {
      nativeCommand,
      nativeResponse: error,
      bridgeStatusMessage,
    };
  }
}

async function getInstalledAppsFromNative() {
  nativeCommand = "GET_INSTALLED_APPS";

  if (!isNativeModuleAvailable()) {
    bridgeStatusMessage = "AppBlockModule is not available.";
    return {
      nativeCommand,
      nativeResponse: [],
      bridgeStatusMessage,
    };
  }

  try {
    nativeResponse = await AppBlockModule.getInstalledApps();
    bridgeStatusMessage = "Installed apps loaded from native module.";

    return {
      nativeCommand,
      nativeResponse,
      bridgeStatusMessage,
    };
  } catch (error) {
    bridgeStatusMessage = "Failed to load installed apps from native module.";

    return {
      nativeCommand,
      nativeResponse: [],
      bridgeStatusMessage,
    };
  }
}

export default {
  sendBlockedAppsToNative,
  startNativeBlocking,
  stopNativeBlocking,
  syncBlockedApps,
  getNativeBlockingState,
  checkNativePermission,
  openNativePermissionSettings,
  monitorNativeForegroundApp,
  getInstalledAppsFromNative,
};