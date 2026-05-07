let selectedApps = [];
let validatedApps = [];
let blockingRules = [];
let blockingState = false;
let logicStatusMessage = "";

function validateSelectedApps(apps) {
  if (!apps || apps.length === 0) {
    validatedApps = [];
    logicStatusMessage = "No apps selected.";
    return {
      isValid: false,
      validatedApps,
      logicStatusMessage,
    };
  }

  validatedApps = apps.filter((app) => {
    return app.appName && app.packageName;
  });

  if (validatedApps.length === 0) {
    logicStatusMessage = "Selected apps are invalid.";
    return {
      isValid: false,
      validatedApps,
      logicStatusMessage,
    };
  }

  logicStatusMessage = "Selected apps validated.";

  return {
    isValid: true,
    validatedApps,
    logicStatusMessage,
  };
}

function prepareBlockList(apps) {
  const validationResult = validateSelectedApps(apps);

  if (!validationResult.isValid) {
    return {
      blockList: [],
      logicStatusMessage: validationResult.logicStatusMessage,
    };
  }

  selectedApps = validationResult.validatedApps;

  const blockList = selectedApps.map((app) => {
    return {
      appName: app.appName,
      packageName: app.packageName,
    };
  });

  logicStatusMessage = "Block list prepared.";

  return {
    blockList,
    logicStatusMessage,
  };
}

function applyBlockingRules(apps) {
  const preparedResult = prepareBlockList(apps);

  if (preparedResult.blockList.length === 0) {
    blockingState = false;

    return {
      blockingState,
      blockingRules,
      logicStatusMessage: preparedResult.logicStatusMessage,
    };
  }

  blockingRules = preparedResult.blockList.map((app) => {
    return {
      packageName: app.packageName,
      appName: app.appName,
      isBlocked: true,
    };
  });

  blockingState = true;
  logicStatusMessage = "Blocking rules applied.";

  return {
    blockingState,
    blockingRules,
    logicStatusMessage,
  };
}

function checkBlockingState() {
  if (blockingState) {
    logicStatusMessage = "App blocking is active.";
  } else {
    logicStatusMessage = "App blocking is inactive.";
  }

  return {
    blockingState,
    blockingRules,
    logicStatusMessage,
  };
}

function updateBlockingRules(apps) {
  const updatedRulesResult = applyBlockingRules(apps);

  logicStatusMessage = "Blocking rules updated.";

  return {
    blockingState: updatedRulesResult.blockingState,
    blockingRules: updatedRulesResult.blockingRules,
    logicStatusMessage,
  };
}

function clearBlockedApps() {
  selectedApps = [];
  validatedApps = [];
  blockingRules = [];
  blockingState = false;
  logicStatusMessage = "Blocked apps cleared.";

  return {
    selectedApps,
    validatedApps,
    blockingRules,
    blockingState,
    logicStatusMessage,
  };
}

export default {
  validateSelectedApps,
  prepareBlockList,
  applyBlockingRules,
  checkBlockingState,
  updateBlockingRules,
  clearBlockedApps,
};