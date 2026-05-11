const availableModes = [
  {
    modeID: 1,
    modeName: "Pomodoro",
    description: "Study using work intervals and short breaks.",
  },
  {
    modeID: 2,
    modeName: "Timer",
    description: "Countdown from the selected duration to zero.",
  },
  {
    modeID: 3,
    modeName: "Stopwatch",
    description: "Count upward until the selected duration is reached.",
  },
];

function displayAvailableModes() {
  return availableModes;
}

function getModeName(mode) {
  if (!mode) {
    return "";
  }

  if (typeof mode === "string") {
    return mode;
  }

  return mode.modeName;
}

function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

function toPositiveNumber(value, fallbackValue) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue <= 0) {
    return fallbackValue;
  }

  return numberValue;
}

function calculatePomodoroIntervalCount(totalMinutes, workIntervalMinutes) {
  const safeTotalMinutes = toPositiveNumber(totalMinutes, 25);
  const safeWorkIntervalMinutes = toPositiveNumber(workIntervalMinutes, 25);

  return Math.max(1, Math.ceil(safeTotalMinutes / safeWorkIntervalMinutes));
}

function normalizeModeSelection(modeSelection) {
  const modeName = getModeName(modeSelection?.selectedMode || modeSelection);

  const customDuration = toPositiveNumber(modeSelection?.customDuration, 25);

  const pomodoroWorkInterval = toPositiveNumber(
    modeSelection?.pomodoroWorkInterval,
    25
  );

  const pomodoroBreakInterval = toPositiveNumber(
    modeSelection?.pomodoroBreakInterval,
    5
  );

  return {
    selectedMode:
      availableModes.find((mode) => mode.modeName === modeName) ||
      availableModes[0],

    customDuration,
    pomodoroWorkInterval,
    pomodoroBreakInterval,

    pomodoroIntervalCount: calculatePomodoroIntervalCount(
      customDuration,
      pomodoroWorkInterval
    ),
  };
}

function validateModeSelection(modeSelection) {
  const normalizedSelection = normalizeModeSelection(modeSelection);
  const modeName = normalizedSelection.selectedMode.modeName;

  if (!modeName) {
    return {
      isValid: false,
      normalizedSelection,
      logicStatusMessage: "Please select a timer mode.",
    };
  }

  if (
    (modeName === "Timer" || modeName === "Stopwatch") &&
    normalizedSelection.customDuration <= 0
  ) {
    return {
      isValid: false,
      normalizedSelection,
      logicStatusMessage: "Please enter a valid duration.",
    };
  }

  if (
    modeName === "Pomodoro" &&
    (normalizedSelection.customDuration <= 0 ||
      normalizedSelection.pomodoroWorkInterval <= 0 ||
      normalizedSelection.pomodoroBreakInterval <= 0)
  ) {
    return {
      isValid: false,
      normalizedSelection,
      logicStatusMessage: "Please enter valid Pomodoro settings.",
    };
  }

  return {
    isValid: true,
    normalizedSelection,
    logicStatusMessage: modeName + " mode is ready.",
  };
}

function createInitialTimerState(modeSelection) {
  const normalizedSelection = normalizeModeSelection(modeSelection);
  const modeName = normalizedSelection.selectedMode.modeName;

  const now = new Date().toISOString();

  const totalDurationSeconds = Math.round(
    normalizedSelection.customDuration * 60
  );

  const workIntervalSeconds = Math.round(
    normalizedSelection.pomodoroWorkInterval * 60
  );

  const breakIntervalSeconds = Math.round(
    normalizedSelection.pomodoroBreakInterval * 60
  );

  if (modeName === "Stopwatch") {
    return {
      modeName,
      isRunning: true,
      isCompleted: false,
      wasStoppedManually: false,

      remainingSeconds: totalDurationSeconds,
      elapsedSeconds: 0,
      totalDurationSeconds,

      pomodoroPhase: "Stopwatch",
      currentPomodoroInterval: 0,
      completedWorkSeconds: 0,
      workIntervalSeconds: 0,
      breakIntervalSeconds: 0,

      startedAt: now,
      updatedAt: now,
    };
  }

  if (modeName === "Pomodoro") {
    return {
      modeName,
      isRunning: true,
      isCompleted: false,
      wasStoppedManually: false,

      remainingSeconds: Math.min(workIntervalSeconds, totalDurationSeconds),
      elapsedSeconds: 0,
      totalDurationSeconds,

      pomodoroPhase: "Work",
      currentPomodoroInterval: 1,
      completedWorkSeconds: 0,
      workIntervalSeconds,
      breakIntervalSeconds,

      startedAt: now,
      updatedAt: now,
    };
  }

  return {
    modeName: "Timer",
    isRunning: true,
    isCompleted: false,
    wasStoppedManually: false,

    remainingSeconds: totalDurationSeconds,
    elapsedSeconds: 0,
    totalDurationSeconds,

    pomodoroPhase: "Timer",
    currentPomodoroInterval: 0,
    completedWorkSeconds: 0,
    workIntervalSeconds: 0,
    breakIntervalSeconds: 0,

    startedAt: now,
    updatedAt: now,
  };
}

function getElapsedWallSeconds(timerState, nowDateObject) {
  if (!timerState?.startedAt) {
    return Number(timerState?.elapsedSeconds) || 0;
  }

  const startMilliseconds = new Date(timerState.startedAt).getTime();
  const nowMilliseconds = nowDateObject.getTime();

  if (Number.isNaN(startMilliseconds) || Number.isNaN(nowMilliseconds)) {
    return Number(timerState?.elapsedSeconds) || 0;
  }

  return Math.max(0, Math.floor((nowMilliseconds - startMilliseconds) / 1000));
}

function getTimerStateFromClock(timerState, nowDateObject = new Date()) {
  if (!timerState || timerState.wasStoppedManually || timerState.isCompleted) {
    return timerState;
  }

  const elapsedWallSeconds = getElapsedWallSeconds(timerState, nowDateObject);
  const updatedAt = nowDateObject.toISOString();

  if (timerState.modeName === "Stopwatch") {
    const elapsedSeconds = Math.min(
      elapsedWallSeconds,
      timerState.totalDurationSeconds
    );

    const remainingSeconds = Math.max(
      0,
      timerState.totalDurationSeconds - elapsedWallSeconds
    );

    return {
      ...timerState,
      elapsedSeconds,
      remainingSeconds,
      isRunning: remainingSeconds !== 0,
      isCompleted: remainingSeconds === 0,
      wasStoppedManually: false,
      updatedAt,
    };
  }

  if (timerState.modeName === "Timer") {
    const remainingSeconds = Math.max(
      0,
      timerState.totalDurationSeconds - elapsedWallSeconds
    );

    return {
      ...timerState,
      elapsedSeconds: Math.min(
        elapsedWallSeconds,
        timerState.totalDurationSeconds
      ),
      remainingSeconds,
      isCompleted: remainingSeconds === 0,
      isRunning: remainingSeconds !== 0,
      wasStoppedManually: false,
      updatedAt,
    };
  }

  if (timerState.modeName === "Pomodoro") {
    let wallSecondsLeft = elapsedWallSeconds;
    let completedWorkSeconds = 0;
    let currentPomodoroInterval = 1;
    let pomodoroPhase = "Work";
    let remainingSeconds = timerState.workIntervalSeconds;

    while (completedWorkSeconds < timerState.totalDurationSeconds) {
      const remainingWorkTotal =
        timerState.totalDurationSeconds - completedWorkSeconds;

      const thisWorkInterval = Math.min(
        timerState.workIntervalSeconds,
        remainingWorkTotal
      );

      if (wallSecondsLeft < thisWorkInterval) {
        pomodoroPhase = "Work";
        remainingSeconds = thisWorkInterval - wallSecondsLeft;
        completedWorkSeconds += wallSecondsLeft;

        return {
          ...timerState,
          remainingSeconds,
          elapsedSeconds: elapsedWallSeconds,
          completedWorkSeconds,
          pomodoroPhase,
          currentPomodoroInterval,
          isCompleted: false,
          isRunning: true,
          wasStoppedManually: false,
          updatedAt,
        };
      }

      wallSecondsLeft -= thisWorkInterval;
      completedWorkSeconds += thisWorkInterval;

      if (completedWorkSeconds >= timerState.totalDurationSeconds) {
        return {
          ...timerState,
          remainingSeconds: 0,
          elapsedSeconds: elapsedWallSeconds,
          completedWorkSeconds,
          pomodoroPhase: "Work",
          currentPomodoroInterval,
          isCompleted: true,
          isRunning: false,
          wasStoppedManually: false,
          updatedAt,
        };
      }

      if (wallSecondsLeft < timerState.breakIntervalSeconds) {
        pomodoroPhase = "Break";
        remainingSeconds = timerState.breakIntervalSeconds - wallSecondsLeft;

        return {
          ...timerState,
          remainingSeconds,
          elapsedSeconds: elapsedWallSeconds,
          completedWorkSeconds,
          pomodoroPhase,
          currentPomodoroInterval,
          isCompleted: false,
          isRunning: true,
          wasStoppedManually: false,
          updatedAt,
        };
      }

      wallSecondsLeft -= timerState.breakIntervalSeconds;
      currentPomodoroInterval += 1;
    }

    return {
      ...timerState,
      remainingSeconds: 0,
      elapsedSeconds: elapsedWallSeconds,
      completedWorkSeconds: timerState.totalDurationSeconds,
      isCompleted: true,
      isRunning: false,
      wasStoppedManually: false,
      updatedAt,
    };
  }

  return timerState;
}

function getNextTimerTick(timerState) {
  return getTimerStateFromClock(timerState, new Date());
}

function getDisplaySeconds(timerState) {
  if (!timerState) {
    return 0;
  }

  if (timerState.modeName === "Stopwatch") {
    return timerState.elapsedSeconds;
  }

  return timerState.remainingSeconds;
}

function getPhaseLabel(timerState) {
  if (!timerState) {
    return "";
  }

  if (timerState.modeName === "Pomodoro") {
    return timerState.pomodoroPhase + " " + timerState.currentPomodoroInterval;
  }

  return timerState.modeName;
}

function stopTimerManually(timerState) {
  if (!timerState) {
    return null;
  }

  return {
    ...timerState,
    isRunning: false,
    isCompleted: false,
    wasStoppedManually: true,
    updatedAt: new Date().toISOString(),
  };
}

function shouldSaveSession(timerState) {
  if (!timerState) {
    return false;
  }

  return (
    timerState.isCompleted === true &&
    timerState.wasStoppedManually !== true
  );
}

export default {
  displayAvailableModes,
  getModeName,
  formatSeconds,
  calculatePomodoroIntervalCount,
  normalizeModeSelection,
  validateModeSelection,
  createInitialTimerState,
  getElapsedWallSeconds,
  getTimerStateFromClock,
  getNextTimerTick,
  getDisplaySeconds,
  getPhaseLabel,
  stopTimerManually,
  shouldSaveSession,
};