// AppInternals/Logic/LogicTimer.js

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
    description: "Count upward until you stop the session.",
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
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);

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

  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
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
      availableModes.find((mode) => mode.modeName === modeName) || availableModes[0],
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

  if (modeName === "Timer" && normalizedSelection.customDuration <= 0) {
    return {
      isValid: false,
      normalizedSelection,
      logicStatusMessage: "Please enter a valid timer duration.",
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

  const totalDurationSeconds = Math.round(normalizedSelection.customDuration * 60);
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
      remainingSeconds: 0,
      elapsedSeconds: 0,
      totalDurationSeconds: 0,
      pomodoroPhase: "Stopwatch",
      currentPomodoroInterval: 0,
      completedWorkSeconds: 0,
      workIntervalSeconds: 0,
      breakIntervalSeconds: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (modeName === "Pomodoro") {
    return {
      modeName,
      isRunning: true,
      isCompleted: false,
      remainingSeconds: Math.min(workIntervalSeconds, totalDurationSeconds),
      elapsedSeconds: 0,
      totalDurationSeconds,
      pomodoroPhase: "Work",
      currentPomodoroInterval: 1,
      completedWorkSeconds: 0,
      workIntervalSeconds,
      breakIntervalSeconds,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    modeName: "Timer",
    isRunning: true,
    isCompleted: false,
    remainingSeconds: totalDurationSeconds,
    elapsedSeconds: 0,
    totalDurationSeconds,
    pomodoroPhase: "Timer",
    currentPomodoroInterval: 0,
    completedWorkSeconds: 0,
    workIntervalSeconds: 0,
    breakIntervalSeconds: 0,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getNextTimerTick(timerState) {
  if (!timerState || timerState.isCompleted) {
    return timerState;
  }

  if (timerState.modeName === "Stopwatch") {
    return {
      ...timerState,
      elapsedSeconds: timerState.elapsedSeconds + 1,
      updatedAt: new Date().toISOString(),
    };
  }

  if (timerState.modeName === "Timer") {
    const nextRemainingSeconds = Math.max(0, timerState.remainingSeconds - 1);
    const nextElapsedSeconds = timerState.elapsedSeconds + 1;

    return {
      ...timerState,
      remainingSeconds: nextRemainingSeconds,
      elapsedSeconds: nextElapsedSeconds,
      isCompleted: nextRemainingSeconds === 0,
      isRunning: nextRemainingSeconds !== 0,
      updatedAt: new Date().toISOString(),
    };
  }

  if (timerState.modeName === "Pomodoro") {
    if (timerState.pomodoroPhase === "Work") {
      const nextRemainingSeconds = Math.max(0, timerState.remainingSeconds - 1);
      const nextCompletedWorkSeconds = timerState.completedWorkSeconds + 1;
      const nextElapsedSeconds = timerState.elapsedSeconds + 1;

      if (nextCompletedWorkSeconds >= timerState.totalDurationSeconds) {
        return {
          ...timerState,
          remainingSeconds: 0,
          elapsedSeconds: nextElapsedSeconds,
          completedWorkSeconds: nextCompletedWorkSeconds,
          isCompleted: true,
          isRunning: false,
          updatedAt: new Date().toISOString(),
        };
      }

      if (nextRemainingSeconds === 0) {
        return {
          ...timerState,
          remainingSeconds: timerState.breakIntervalSeconds,
          elapsedSeconds: nextElapsedSeconds,
          completedWorkSeconds: nextCompletedWorkSeconds,
          pomodoroPhase: "Break",
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        ...timerState,
        remainingSeconds: nextRemainingSeconds,
        elapsedSeconds: nextElapsedSeconds,
        completedWorkSeconds: nextCompletedWorkSeconds,
        updatedAt: new Date().toISOString(),
      };
    }

    const nextBreakRemainingSeconds = Math.max(
      0,
      timerState.remainingSeconds - 1
    );
    const nextElapsedSeconds = timerState.elapsedSeconds + 1;

    if (nextBreakRemainingSeconds === 0) {
      const remainingWorkSeconds =
        timerState.totalDurationSeconds - timerState.completedWorkSeconds;

      return {
        ...timerState,
        remainingSeconds: Math.min(
          timerState.workIntervalSeconds,
          remainingWorkSeconds
        ),
        elapsedSeconds: nextElapsedSeconds,
        pomodoroPhase: "Work",
        currentPomodoroInterval: timerState.currentPomodoroInterval + 1,
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      ...timerState,
      remainingSeconds: nextBreakRemainingSeconds,
      elapsedSeconds: nextElapsedSeconds,
      updatedAt: new Date().toISOString(),
    };
  }

  return timerState;
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
    return (
      timerState.pomodoroPhase +
      " " +
      timerState.currentPomodoroInterval
    );
  }

  return timerState.modeName;
}

export default {
  displayAvailableModes,
  getModeName,
  formatSeconds,
  calculatePomodoroIntervalCount,
  normalizeModeSelection,
  validateModeSelection,
  createInitialTimerState,
  getNextTimerTick,
  getDisplaySeconds,
  getPhaseLabel,
};