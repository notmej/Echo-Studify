const TASK_DIFFICULTIES = ["Hard", "Medium", "Easy"];
const TASK_FILTERS = ["All", "Completed", "Pending"];

function normalizeDifficulty(difficultyLevel) {
  if (!difficultyLevel) {
    return "";
  }

  const cleanValue = String(difficultyLevel).trim().toLowerCase();

  if (cleanValue === "hard" || cleanValue === "high") {
    return "Hard";
  }

  if (cleanValue === "medium" || cleanValue === "med") {
    return "Medium";
  }

  if (cleanValue === "easy" || cleanValue === "low") {
    return "Easy";
  }

  return "";
}

function cleanTaskInput(taskInput) {
  return String(taskInput || "").trim();
}

function cleanOptionalInput(value) {
  return String(value || "").trim();
}

function validateTask(task) {
  const taskTitle = cleanTaskInput(task?.taskTitle || task?.TaskTitle);

  if (!taskTitle) {
    return {
      isValid: false,
      logicStatusMessage: "Please enter a task title.",
      cleanTask: null,
    };
  }

  return {
    isValid: true,
    logicStatusMessage: "Task is valid.",
    cleanTask: {
      taskTitle,
      taskDescription: cleanOptionalInput(
        task?.taskDescription || task?.TaskDescription
      ),
      difficultyLevel: normalizeDifficulty(
        task?.difficultyLevel || task?.DifficultyLevel
      ),
      dueDate: cleanOptionalInput(task?.dueDate || task?.DueDate),
    },
  };
}

function getTaskDifficultyOrder(dailyEnergyLevel, energyLogic) {
  if (!dailyEnergyLevel || !energyLogic) {
    return [];
  }

  return energyLogic.getTaskOrderForEnergy(dailyEnergyLevel);
}

function orderTasks(tasks, dailyEnergyLevel, energyLogic) {
  const taskArray = Array.isArray(tasks) ? [...tasks] : [];
  const difficultyOrder = getTaskDifficultyOrder(dailyEnergyLevel, energyLogic);

  if (difficultyOrder.length === 0) {
    return taskArray.sort((a, b) => {
      const firstOrder = Number(a.ManualOrder ?? a.manualOrder ?? 0);
      const secondOrder = Number(b.ManualOrder ?? b.manualOrder ?? 0);
      return firstOrder - secondOrder;
    });
  }

  return taskArray.sort((a, b) => {
    const firstDifficulty = normalizeDifficulty(
      a.DifficultyLevel ?? a.difficultyLevel
    );
    const secondDifficulty = normalizeDifficulty(
      b.DifficultyLevel ?? b.difficultyLevel
    );

    const firstIndex = difficultyOrder.includes(firstDifficulty)
      ? difficultyOrder.indexOf(firstDifficulty)
      : 999;

    const secondIndex = difficultyOrder.includes(secondDifficulty)
      ? difficultyOrder.indexOf(secondDifficulty)
      : 999;

    if (firstIndex !== secondIndex) {
      return firstIndex - secondIndex;
    }

    const firstOrder = Number(a.ManualOrder ?? a.manualOrder ?? 0);
    const secondOrder = Number(b.ManualOrder ?? b.manualOrder ?? 0);
    return firstOrder - secondOrder;
  });
}

function filterTasks(tasks, filterOption) {
  const taskArray = Array.isArray(tasks) ? [...tasks] : [];

  if (filterOption === "Completed") {
    return taskArray.filter((task) => Number(task.IsCompleted) === 1);
  }

  if (filterOption === "Pending") {
    return taskArray.filter((task) => Number(task.IsCompleted) !== 1);
  }

  return taskArray;
}

export default {
  TASK_DIFFICULTIES,
  TASK_FILTERS,
  normalizeDifficulty,
  cleanTaskInput,
  cleanOptionalInput,
  validateTask,
  orderTasks,
  filterTasks,
};