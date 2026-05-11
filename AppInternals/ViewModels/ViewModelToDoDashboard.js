import { useEffect, useRef, useState } from "react";

import LogicToDo from "../Logic/LogicToDo";
import EnergyLogic from "../Logic/EnergyLogic";
import ToDoRepo from "../Repos/ToDoRepo";
import EnergyRepo from "../Repos/EnergyRepo";

export default function ViewModelToDoDashboard(navigation) {
  const [taskList, setTaskList] = useState([]);
  const [displayedTaskList, setDisplayedTaskList] = useState([]);

  const [taskInput, setTaskInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [dailyEnergyLevel, setDailyEnergyLevel] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [statusMessage, setStatusMessage] = useState("Loading tasks...");
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  const initPromiseRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    initializeToDoDashboard();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    refreshDisplayedTasks(taskList, filterOption, dailyEnergyLevel);
  }, [taskList, filterOption, dailyEnergyLevel]);

  async function initializeToDoDashboard() {
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    initPromiseRef.current = initializeToDoDashboardInternal();
    const result = await initPromiseRef.current;
    initPromiseRef.current = null;
    return result;
  }

  async function initializeToDoDashboardInternal() {
    try {
      setIsDatabaseReady(false);
      setStatusMessage("Loading tasks...");

      const todoReady = await ToDoRepo.init();
      const energyReady = await EnergyRepo.init();

      if (!todoReady || !energyReady) {
        setIsDatabaseReady(false);
        setStatusMessage("Database failed to load.");
        return false;
      }

      const savedEnergy = await EnergyRepo.getTodayEnergyLevel();
      const tasks = await ToDoRepo.getTasks("All");

      if (!isMountedRef.current) {
        return false;
      }

      setDailyEnergyLevel(savedEnergy);
      setTaskList(tasks);
      refreshDisplayedTasks(tasks, filterOption, savedEnergy);
      setIsDatabaseReady(true);

      if (tasks.length === 0) {
        setStatusMessage("No tasks yet.");
      } else if (savedEnergy) {
        setStatusMessage("Tasks loaded and sorted for " + savedEnergy + " energy.");
      } else {
        setStatusMessage("Tasks loaded in your manual order.");
      }

      return true;
    } catch (error) {
      console.log("initializeToDoDashboard error:", error);
      setIsDatabaseReady(false);
      setStatusMessage("Tasks failed to load.");
      return false;
    }
  }

  async function ensureDatabaseReady() {
    if (isDatabaseReady) {
      return true;
    }

    setStatusMessage("Database is loading. Trying again...");
    return await initializeToDoDashboard();
  }

  function refreshDisplayedTasks(tasks, filter, energyLevel) {
    const filteredTasks = LogicToDo.filterTasks(tasks, filter);
    const orderedTasks = LogicToDo.orderTasks(
      filteredTasks,
      energyLevel,
      EnergyLogic
    );

    setDisplayedTaskList(orderedTasks);
  }

  async function reloadTasks(optionalEnergyLevel = dailyEnergyLevel) {
    const tasks = await ToDoRepo.getTasks("All");
    setTaskList(tasks);
    refreshDisplayedTasks(tasks, filterOption, optionalEnergyLevel);
    return tasks;
  }

  async function onCreateTask() {
    const databaseReady = await ensureDatabaseReady();

    if (!databaseReady) {
      setStatusMessage("Database is not ready yet. Please reopen the Tasks page.");
      return;
    }

    const validationResult = LogicToDo.validateTask({
      taskTitle: taskInput,
      taskDescription,
      difficultyLevel: selectedDifficulty,
      dueDate,
    });

    if (!validationResult.isValid) {
      setStatusMessage(validationResult.logicStatusMessage);
      return;
    }

    const taskID = await ToDoRepo.createTask(validationResult.cleanTask);

    if (!taskID) {
      setStatusMessage("Task could not be created.");
      return;
    }

    setTaskInput("");
    setTaskDescription("");
    setDueDate("");
    setSelectedDifficulty("");

    const tasks = await reloadTasks();

    if (tasks.length > 0) {
      setStatusMessage("Task created.");
    } else {
      setStatusMessage("Task saved, but the list could not refresh.");
    }
  }

  async function onDeleteTask(taskID) {
    const databaseReady = await ensureDatabaseReady();

    if (!databaseReady) {
      setStatusMessage("Database is not ready.");
      return;
    }

    const wasDeleted = await ToDoRepo.deleteTask(taskID);
    await reloadTasks();

    if (wasDeleted) {
      setStatusMessage("Task deleted.");
    } else {
      setStatusMessage("Task could not be deleted.");
    }
  }

  async function onMarkComplete(taskID) {
    const databaseReady = await ensureDatabaseReady();

    if (!databaseReady) {
      setStatusMessage("Database is not ready.");
      return;
    }

    const wasUpdated = await ToDoRepo.toggleTaskCompletion(taskID);
    await reloadTasks();

    if (wasUpdated) {
      setStatusMessage("Task updated.");
    } else {
      setStatusMessage("Task could not be updated.");
    }
  }

  function onFilterChange(filter) {
    setFilterOption(filter);

    if (filter === "All") {
      setStatusMessage("Showing all tasks.");
    } else if (filter === "Completed") {
      setStatusMessage("Showing completed tasks.");
    } else {
      setStatusMessage("Showing pending tasks.");
    }
  }

  async function onDailyEnergyChange(energyLevel) {
    const databaseReady = await ensureDatabaseReady();

    if (!databaseReady) {
      setStatusMessage("Database is not ready.");
      return;
    }

    const normalizedEnergy = EnergyLogic.normalizeEnergyLevel(energyLevel);

    if (!EnergyLogic.isValidEnergyLevel(normalizedEnergy)) {
      setDailyEnergyLevel("");
      await EnergyRepo.clearEnergyLevel();
      await reloadTasks("");
      setStatusMessage("Energy level cleared. Tasks are in manual order.");
      return;
    }

    const savedEnergy = await EnergyRepo.saveTodayEnergyLevel(normalizedEnergy);
    setDailyEnergyLevel(savedEnergy);
    await reloadTasks(savedEnergy);

    setStatusMessage("Energy saved for today: " + savedEnergy + ". Tasks reordered.");
  }

  async function onClearDailyEnergy() {
    const databaseReady = await ensureDatabaseReady();

    if (!databaseReady) {
      setStatusMessage("Database is not ready.");
      return;
    }

    await EnergyRepo.clearEnergyLevel();
    setDailyEnergyLevel("");
    await reloadTasks("");
    setStatusMessage("Energy level cleared. Tasks are in manual order.");
  }

  function showStatusMessage() {
    return statusMessage;
  }

  function goToHome() {
    if (navigation) {
      navigation.navigate("Home");
    }
  }

  function goToStats() {
    if (navigation) {
      navigation.navigate("Stats");
    }
  }

  function goToAppBlock() {
    if (navigation) {
      navigation.navigate("AppBlock");
    }
  }

  return {
    taskList,
    displayedTaskList,

    taskInput,
    setTaskInput,
    taskDescription,
    setTaskDescription,
    dueDate,
    setDueDate,
    selectedDifficulty,
    setSelectedDifficulty,

    dailyEnergyLevel,
    filterOption,
    statusMessage,
    isDatabaseReady,

    difficultyOptions: LogicToDo.TASK_DIFFICULTIES,
    filterOptions: LogicToDo.TASK_FILTERS,
    energyOptions: EnergyLogic.ENERGY_LEVELS,

    initializeToDoDashboard,
    reloadTasks,
    onCreateTask,
    onDeleteTask,
    onMarkComplete,
    onFilterChange,
    onDailyEnergyChange,
    onClearDailyEnergy,
    showStatusMessage,

    goToHome,
    goToStats,
    goToAppBlock,
  };
}