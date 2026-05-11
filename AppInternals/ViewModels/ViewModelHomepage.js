// AppInternals/ViewModels/ViewModelHomePage.js

import { useEffect, useState } from "react";

import LogicTimer from "../Logic/LogicTimer";
import TimerRepo from "../Repos/TimerRepo";

export default function ViewModelHomePage(navigation) {
  const availableModes = LogicTimer.displayAvailableModes();

  const [selectedMode, setSelectedMode] = useState(availableModes[0]);
  const [customDuration, setCustomDurationState] = useState("25");
  const [pomodoroWorkInterval, setPomodoroWorkInterval] = useState("25");
  const [pomodoroBreakInterval, setPomodoroBreakInterval] = useState("5");

  const [timerState, setTimerState] = useState(
    LogicTimer.createInitialTimerState({
      selectedMode: availableModes[0],
      customDuration: "25",
      pomodoroWorkInterval: "25",
      pomodoroBreakInterval: "5",
    })
  );

  const [displayedTime, setDisplayedTime] = useState("25:00");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSessionCountDisplay, setCurrentSessionCountDisplay] = useState(0);
  const [todayStreakDisplay, setTodayStreakDisplay] = useState(0);
  const [selectedBlockedApps, setSelectedBlockedApps] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Ready to focus");
  const [modeSelectionVisible, setModeSelectionVisible] = useState(false);

  useEffect(() => {
    initializeHomePage();
  }, []);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimerState((previousTimerState) => {
        const nextTimerState = LogicTimer.getNextTimerTick(previousTimerState);

        setDisplayedTime(
          LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(nextTimerState))
        );

        TimerRepo.updateTimerState(nextTimerState);

        if (nextTimerState.isCompleted) {
          setIsTimerRunning(false);
          finishCompletedSession(nextTimerState);
        }

        return nextTimerState;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  async function initializeHomePage() {
    await TimerRepo.init();

    const savedModeSelection = await TimerRepo.getModeSelection();

    if (savedModeSelection) {
      const savedMode =
        availableModes.find(
          (mode) => mode.modeName === savedModeSelection.timerMode
        ) || availableModes[0];

      setSelectedMode(savedMode);
      setCustomDurationState(String(savedModeSelection.customDuration));
      setPomodoroWorkInterval(String(savedModeSelection.pomodoroWorkInterval));
      setPomodoroBreakInterval(String(savedModeSelection.pomodoroBreakInterval));

      const initialTimerState = LogicTimer.createInitialTimerState({
        selectedMode: savedMode,
        customDuration: String(savedModeSelection.customDuration),
        pomodoroWorkInterval: String(savedModeSelection.pomodoroWorkInterval),
        pomodoroBreakInterval: String(savedModeSelection.pomodoroBreakInterval),
      });

      setTimerState(initialTimerState);
      setDisplayedTime(
        LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(initialTimerState))
      );
    }

    const history = await TimerRepo.getSessionHistory();
    setCurrentSessionCountDisplay(history.length);
    setTodayStreakDisplay(calculateTodayStreak(history));
  }

  function selectMode(mode) {
    setSelectedMode(mode);

    const resetTimerState = LogicTimer.createInitialTimerState({
      selectedMode: mode,
      customDuration,
      pomodoroWorkInterval,
      pomodoroBreakInterval,
    });

    setTimerState(resetTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(resetTimerState))
    );

    setStatusMessage(mode.modeName + " mode selected.");
  }

  function setCustomDuration(duration) {
    setCustomDurationState(duration);

    const resetTimerState = LogicTimer.createInitialTimerState({
      selectedMode,
      customDuration: duration,
      pomodoroWorkInterval,
      pomodoroBreakInterval,
    });

    setTimerState(resetTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(resetTimerState))
    );

    setStatusMessage("Duration updated.");
  }

  function setPomodoroIntervals(workInterval, breakInterval) {
    setPomodoroWorkInterval(workInterval);
    setPomodoroBreakInterval(breakInterval);

    const resetTimerState = LogicTimer.createInitialTimerState({
      selectedMode,
      customDuration,
      pomodoroWorkInterval: workInterval,
      pomodoroBreakInterval: breakInterval,
    });

    setTimerState(resetTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(resetTimerState))
    );

    setStatusMessage("Pomodoro intervals updated.");
  }

  async function saveModeSelection() {
    const validationResult = LogicTimer.validateModeSelection({
      selectedMode,
      customDuration,
      pomodoroWorkInterval,
      pomodoroBreakInterval,
    });

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return null;
    }

    await TimerRepo.saveModeSelection(validationResult.normalizedSelection);

    const resetTimerState = LogicTimer.createInitialTimerState(
      validationResult.normalizedSelection
    );

    setTimerState(resetTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(resetTimerState))
    );
    setStatusMessage("Timer mode saved.");

    return validationResult.normalizedSelection;
  }

  function displayAvailableModes() {
    return availableModes;
  }

  async function resetModeSettings() {
    const defaultMode = availableModes[0];

    setSelectedMode(defaultMode);
    setCustomDurationState("25");
    setPomodoroWorkInterval("25");
    setPomodoroBreakInterval("5");

    const defaultSelection = LogicTimer.normalizeModeSelection({
      selectedMode: defaultMode,
      customDuration: "25",
      pomodoroWorkInterval: "25",
      pomodoroBreakInterval: "5",
    });

    await TimerRepo.saveModeSelection(defaultSelection);

    const resetTimerState = LogicTimer.createInitialTimerState(defaultSelection);
    setTimerState(resetTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(resetTimerState))
    );

    setStatusMessage("Timer mode settings reset.");
  }

  async function onStartSession() {
    if (isTimerRunning) {
      setStatusMessage("Timer is already running.");
      return;
    }

    const validationResult = LogicTimer.validateModeSelection({
      selectedMode,
      customDuration,
      pomodoroWorkInterval,
      pomodoroBreakInterval,
    });

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return;
    }

    await TimerRepo.saveModeSelection(validationResult.normalizedSelection);

    const initialTimerState = LogicTimer.createInitialTimerState(
      validationResult.normalizedSelection
    );

    const activeSession = await TimerRepo.startSession(
      validationResult.normalizedSelection,
      initialTimerState
    );

    if (!activeSession) {
      setStatusMessage("Could not start study session.");
      return;
    }

    setTimerState(initialTimerState);
    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(initialTimerState))
    );
    setIsTimerRunning(true);
    setStatusMessage("Study session started.");
  }

  async function onStopSession() {
    if (!isTimerRunning) {
      setStatusMessage("Timer is not running.");
      return;
    }

    const stoppedTimerState = {
      ...timerState,
      isRunning: false,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };

    setIsTimerRunning(false);
    setTimerState(stoppedTimerState);

    await TimerRepo.stopSession(stoppedTimerState);

    const history = await TimerRepo.getSessionHistory();
    setCurrentSessionCountDisplay(history.length);
    setTodayStreakDisplay(calculateTodayStreak(history));

    setStatusMessage("Study session stopped.");
  }

  async function finishCompletedSession(finalTimerState) {
    await TimerRepo.stopSession(finalTimerState);

    const history = await TimerRepo.getSessionHistory();
    setCurrentSessionCountDisplay(history.length);
    setTodayStreakDisplay(calculateTodayStreak(history));

    setStatusMessage("Study session completed.");
  }

  function showTimer() {
    return displayedTime;
  }

  function showSessionCount() {
    return currentSessionCountDisplay;
  }

  function showStreak() {
    return todayStreakDisplay;
  }

  function showStatusMessage() {
    return statusMessage;
  }

  function showTimerPhase() {
    return LogicTimer.getPhaseLabel(timerState);
  }

  function goToModeSelection() {
    setModeSelectionVisible(!modeSelectionVisible);
  }

  function goToAppBlockSelection() {
    navigation.navigate("AppBlock");
    setStatusMessage("Navigate to blocked apps selection.");
  }

  function calculateTodayStreak(history) {
    const today = new Date().toISOString().split("T")[0];

    const completedToday = history.some((session) => {
      return session.StartTime && session.StartTime.startsWith(today);
    });

    return completedToday ? 1 : 0;
  }

  return {
    selectedMode,
    availableModes,
    customDuration,
    pomodoroWorkInterval,
    pomodoroBreakInterval,
    statusMessage,

    timerState,
    displayedTime,
    isTimerRunning,
    currentSessionCountDisplay,
    todayStreakDisplay,
    selectedBlockedApps,
    modeSelectionVisible,

    selectMode,
    setCustomDuration,
    setPomodoroIntervals,
    saveModeSelection,
    displayAvailableModes,
    resetModeSettings,

    onStartSession,
    onStopSession,
    showTimer,
    showSessionCount,
    showStreak,
    showStatusMessage,
    showTimerPhase,
    goToModeSelection,
    goToAppBlockSelection,
  };
}