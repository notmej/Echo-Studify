import { AppState } from "react-native";
import { useEffect, useRef, useState } from "react";

import LogicTimer from "../Logic/LogicTimer";
import TimerRepo from "../Repos/TimerRepo";
import AppBlockRepo from "../Repos/AppBlockRepo";

export default function ViewModelHomePage(navigation) {
  const [selectedTimerMode, setSelectedTimerMode] = useState("Pomodoro");
  const [durationInput, setDurationInput] = useState("25");

  const [timerState, setTimerState] = useState(null);
  const [displayedTime, setDisplayedTime] = useState("25:00");
  const [timerPhaseLabel, setTimerPhaseLabel] = useState("Pomodoro");

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSessionCountDisplay, setCurrentSessionCountDisplay] =
    useState(0);
  const [todayStreakDisplay, setTodayStreakDisplay] = useState(0);

  const [selectedBlockedApps, setSelectedBlockedApps] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Loading Studify data...");
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [modeSelectionVisible, setModeSelectionVisible] = useState(false);

  const timerStateRef = useRef(null);
  const sessionAlreadySavedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const [modeSelection, setModeSelection] = useState({
    selectedMode: {
      modeID: 1,
      modeName: "Pomodoro",
      description: "Study using work intervals and short breaks.",
    },
    customDuration: 25,
    pomodoroWorkInterval: 25,
    pomodoroBreakInterval: 5,
    pomodoroIntervalCount: 1,
  });

  useEffect(() => {
    initializeHomePage();
  }, []);

  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const intervalID = setInterval(() => {
      updateTimerFromClock();
    }, 1000);

    return () => clearInterval(intervalID);
  }, [isTimerRunning]);

  function createStoppedPreviewTimerState(selection) {
    const previewState = LogicTimer.createInitialTimerState(selection);

    return {
      ...previewState,
      isRunning: false,
      isCompleted: false,
      wasStoppedManually: false,
    };
  }

  function setPreviewTimerDisplay(selection) {
    if (isTimerRunning) {
      return;
    }

    const durationNumber = Number(selection.customDuration);

    if (Number.isNaN(durationNumber) || durationNumber <= 0) {
      return;
    }

    const normalizedSelection = LogicTimer.normalizeModeSelection(selection);
    const previewState = createStoppedPreviewTimerState(normalizedSelection);

    timerStateRef.current = previewState;
    setTimerState(previewState);

    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(previewState))
    );

    setTimerPhaseLabel(LogicTimer.getPhaseLabel(previewState));
  }

  async function handleAppStateChange(nextAppState) {
    const previousAppState = appStateRef.current;
    appStateRef.current = nextAppState;

    if (
      previousAppState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      await updateTimerFromClock();
    }
  }

  async function updateTimerFromClock() {
    const previousTimerState = timerStateRef.current;

    if (!previousTimerState || previousTimerState.isRunning !== true) {
      return;
    }

    const nextTimerState = LogicTimer.getTimerStateFromClock(
      previousTimerState,
      new Date()
    );

    timerStateRef.current = nextTimerState;
    setTimerState(nextTimerState);

    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(nextTimerState))
    );

    setTimerPhaseLabel(LogicTimer.getPhaseLabel(nextTimerState));

    if (
      LogicTimer.shouldSaveSession(nextTimerState) &&
      sessionAlreadySavedRef.current === false
    ) {
      sessionAlreadySavedRef.current = true;

      setIsTimerRunning(false);
      setStatusMessage("Session completed and saved.");

      await TimerRepo.stopSession(nextTimerState);
      await refreshSessionCount();

      return;
    }

    if (!LogicTimer.shouldSaveSession(nextTimerState)) {
      await TimerRepo.updateTimerState(nextTimerState);
    }
  }

  async function initializeHomePage() {
    try {
      setIsDatabaseReady(false);
      setStatusMessage("Loading Studify data...");

      await TimerRepo.init();
      await AppBlockRepo.init();

      const savedModeSelection = await TimerRepo.getModeSelection();

      if (savedModeSelection) {
        const normalizedSelection =
          LogicTimer.normalizeModeSelection(savedModeSelection);

        setModeSelection(normalizedSelection);
        setSelectedTimerMode(normalizedSelection.selectedMode.modeName);
        setDurationInput(String(normalizedSelection.customDuration));

        const previewState = createStoppedPreviewTimerState(normalizedSelection);

        timerStateRef.current = previewState;
        setTimerState(previewState);

        setDisplayedTime(
          LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(previewState))
        );

        setTimerPhaseLabel(LogicTimer.getPhaseLabel(previewState));
      } else {
        const previewState = createStoppedPreviewTimerState(modeSelection);

        timerStateRef.current = previewState;
        setTimerState(previewState);

        setDisplayedTime(
          LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(previewState))
        );

        setTimerPhaseLabel(LogicTimer.getPhaseLabel(previewState));
      }

      const activeSession = await TimerRepo.getActiveSession();

      if (activeSession && activeSession.TimerState) {
        try {
          const restoredTimerState = JSON.parse(activeSession.TimerState);

          if (
            restoredTimerState &&
            restoredTimerState.isRunning === true &&
            restoredTimerState.wasStoppedManually !== true
          ) {
            const updatedRestoredTimerState = LogicTimer.getTimerStateFromClock(
              restoredTimerState,
              new Date()
            );

            if (
              updatedRestoredTimerState &&
              updatedRestoredTimerState.wasStoppedManually !== true &&
              updatedRestoredTimerState.isCompleted === true
            ) {
              timerStateRef.current = updatedRestoredTimerState;
              sessionAlreadySavedRef.current = true;

              setTimerState(updatedRestoredTimerState);
              setIsTimerRunning(false);

              setDisplayedTime(
                LogicTimer.formatSeconds(
                  LogicTimer.getDisplaySeconds(updatedRestoredTimerState)
                )
              );

              setTimerPhaseLabel(
                LogicTimer.getPhaseLabel(updatedRestoredTimerState)
              );

              await TimerRepo.stopSession(updatedRestoredTimerState);
              await refreshSessionCount();

              setStatusMessage("Session completed and saved.");
            } else if (
              updatedRestoredTimerState &&
              updatedRestoredTimerState.isRunning === true &&
              updatedRestoredTimerState.wasStoppedManually !== true
            ) {
              timerStateRef.current = updatedRestoredTimerState;
              sessionAlreadySavedRef.current = false;

              setTimerState(updatedRestoredTimerState);
              setIsTimerRunning(true);

              setDisplayedTime(
                LogicTimer.formatSeconds(
                  LogicTimer.getDisplaySeconds(updatedRestoredTimerState)
                )
              );

              setTimerPhaseLabel(
                LogicTimer.getPhaseLabel(updatedRestoredTimerState)
              );

              setStatusMessage("Active session restored.");
            }
          }
        } catch (error) {
          console.log("Restore active timer error:", error);
        }
      }

      await refreshSessionCount();
      await refreshBlockedAppsDisplay();

      setIsDatabaseReady(true);

      if (!timerStateRef.current?.isRunning) {
        setStatusMessage("Ready to focus.");
      }
    } catch (error) {
      console.log("initializeHomePage error:", error);
      setIsDatabaseReady(false);
      setStatusMessage("Database failed to load.");
    }
  }

  async function refreshSessionCount() {
    const sessions = await TimerRepo.getSessionHistory();

    setCurrentSessionCountDisplay(sessions.length);

    if (sessions.length > 0) {
      setTodayStreakDisplay(1);
    } else {
      setTodayStreakDisplay(0);
    }
  }

  async function refreshBlockedAppsDisplay() {
    const blockedApps = await AppBlockRepo.getBlockedApps();
    setSelectedBlockedApps(blockedApps);
  }

  function onDurationInputChange(valueInMinutes) {
    setDurationInput(String(valueInMinutes));

    const updatedSelection = {
      ...modeSelection,
      customDuration: valueInMinutes,
    };

    setModeSelection(updatedSelection);
    setPreviewTimerDisplay(updatedSelection);
  }

  function selectMode(mode) {
    const updatedSelection = {
      ...modeSelection,
      selectedMode: mode,
    };

    setModeSelection(updatedSelection);
    setSelectedTimerMode(mode.modeName);
    setPreviewTimerDisplay(updatedSelection);
  }

  function setCustomDuration(valueInMinutes) {
    onDurationInputChange(valueInMinutes);
  }

  function setPomodoroIntervals(workIntervalInMinutes, breakIntervalInMinutes) {
    const updatedSelection = {
      ...modeSelection,
      pomodoroWorkInterval: workIntervalInMinutes,
      pomodoroBreakInterval: breakIntervalInMinutes,
    };

    setModeSelection(updatedSelection);

    const workNumber = Number(workIntervalInMinutes);
    const breakNumber = Number(breakIntervalInMinutes);

    if (
      !Number.isNaN(workNumber) &&
      workNumber > 0 &&
      !Number.isNaN(breakNumber) &&
      breakNumber > 0
    ) {
      setPreviewTimerDisplay(updatedSelection);
    }
  }

  async function onModeSelectionSaved(newModeSelection) {
    const validationResult = LogicTimer.validateModeSelection(newModeSelection);

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return false;
    }

    const normalizedSelection = validationResult.normalizedSelection;

    setModeSelection(normalizedSelection);
    setSelectedTimerMode(normalizedSelection.selectedMode.modeName);
    setDurationInput(String(normalizedSelection.customDuration));

    const previewState = createStoppedPreviewTimerState(normalizedSelection);

    timerStateRef.current = previewState;
    setTimerState(previewState);

    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(previewState))
    );

    setTimerPhaseLabel(LogicTimer.getPhaseLabel(previewState));

    const saved = await TimerRepo.saveModeSelection(normalizedSelection);

    if (saved) {
      setStatusMessage("Timer mode saved.");
      setModeSelectionVisible(false);
      return true;
    }

    setStatusMessage("Timer mode could not be saved.");
    return false;
  }

  async function saveModeSelection() {
    const validationResult = LogicTimer.validateModeSelection(modeSelection);

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return false;
    }

    return await onModeSelectionSaved(validationResult.normalizedSelection);
  }

  function resetModeSettings() {
    const resetSelection = {
      selectedMode: {
        modeID: 1,
        modeName: "Pomodoro",
        description: "Study using work intervals and short breaks.",
      },
      customDuration: 25,
      pomodoroWorkInterval: 25,
      pomodoroBreakInterval: 5,
      pomodoroIntervalCount: 1,
    };

    const normalizedSelection = LogicTimer.normalizeModeSelection(resetSelection);

    setModeSelection(normalizedSelection);
    setSelectedTimerMode(normalizedSelection.selectedMode.modeName);
    setDurationInput(String(normalizedSelection.customDuration));
    setPreviewTimerDisplay(normalizedSelection);
  }

  async function onStartSession() {
    if (!isDatabaseReady) {
      setStatusMessage("Database is still loading.");
      return;
    }

    const validationResult = LogicTimer.validateModeSelection(modeSelection);

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return;
    }

    sessionAlreadySavedRef.current = false;

    const normalizedSelection = validationResult.normalizedSelection;

    const initialTimerState =
      LogicTimer.createInitialTimerState(normalizedSelection);

    setModeSelection(normalizedSelection);

    timerStateRef.current = initialTimerState;
    setTimerState(initialTimerState);

    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(initialTimerState))
    );

    setTimerPhaseLabel(LogicTimer.getPhaseLabel(initialTimerState));
    setIsTimerRunning(true);

    await TimerRepo.startSession(normalizedSelection, initialTimerState);

    setStatusMessage("Study session started.");
  }

  async function onStopSession() {
    const stoppedState = LogicTimer.stopTimerManually(timerStateRef.current);

    timerStateRef.current = stoppedState;
    sessionAlreadySavedRef.current = true;

    setTimerState(stoppedState);
    setIsTimerRunning(false);

    setDisplayedTime(
      LogicTimer.formatSeconds(LogicTimer.getDisplaySeconds(stoppedState))
    );

    setTimerPhaseLabel(LogicTimer.getPhaseLabel(stoppedState));

    setStatusMessage(
      "Session stopped. It was not saved because the timer did not finish."
    );

    await TimerRepo.clearActiveSession();
    await refreshSessionCount();
  }

  function showTimer() {
    return displayedTime;
  }

  function showTimerPhase() {
    return timerPhaseLabel;
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

  function goToModeSelection() {
    setModeSelectionVisible(!modeSelectionVisible);
    setStatusMessage("Timer mode selection opened.");
  }

  function goToAppBlockSelection() {
    if (navigation) {
      navigation.navigate("AppBlock");
    }
  }

  function getSelectedBlockedAppsText() {
    if (!selectedBlockedApps || selectedBlockedApps.length === 0) {
      return "No blocked apps selected";
    }

    return selectedBlockedApps.join(", ");
  }

  return {
    selectedTimerMode,
    setSelectedTimerMode,

    durationInput,
    setDurationInput: onDurationInputChange,

    timerState,
    displayedTime,
    timerPhaseLabel,
    isTimerRunning,

    currentSessionCountDisplay,
    todayStreakDisplay,
    selectedBlockedApps,
    statusMessage,
    isDatabaseReady,

    modeSelection,
    setModeSelection,

    onModeSelectionSaved,
    onStartSession,
    onStopSession,

    showTimer,
    showTimerPhase,
    showSessionCount,
    showStreak,
    showStatusMessage,
    goToModeSelection,
    goToAppBlockSelection,
    getSelectedBlockedAppsText,

    initializeHomePage,
    refreshSessionCount,
    refreshBlockedAppsDisplay,

    selectedMode: modeSelection.selectedMode,
    availableModes: LogicTimer.displayAvailableModes(),
    customDuration: String(modeSelection.customDuration),
    pomodoroWorkInterval: String(modeSelection.pomodoroWorkInterval),
    pomodoroBreakInterval: String(modeSelection.pomodoroBreakInterval),
    modeSelectionVisible,

    selectMode,
    setCustomDuration,
    setPomodoroIntervals,
    saveModeSelection,
    displayAvailableModes: LogicTimer.displayAvailableModes,
    resetModeSettings,
  };
}