import test from "node:test";
import assert from "node:assert/strict";
import { loadDefaultExport } from "./hlpr/loadDefaultExport.mjs";

const EnergyLogic = loadDefaultExport([
  "AppInternals/Logic/EnergyLogic.js",
  "AppInternals/Logic/EnergyLogic(1).js",
  "Logic/EnergyLogic.js",
  "EnergyLogic.js",
  "EnergyLogic(1).js",
]);

const LogicToDo = loadDefaultExport([
  "AppInternals/Logic/LogicToDo.js",
  "AppInternals/Logic/LogicToDo(2).js",
  "Logic/LogicToDo.js",
  "LogicToDo.js",
  "LogicToDo(2).js",
]);

test("energy values are normalized", () => {
  assert.equal(EnergyLogic.normalizeEnergyLevel("hard"), "High");
  assert.equal(EnergyLogic.normalizeEnergyLevel("med"), "Medium");
  assert.equal(EnergyLogic.normalizeEnergyLevel("easy"), "Low");
  assert.equal(EnergyLogic.normalizeEnergyLevel("random"), "");
});

test("high energy orders hard tasks first", () => {
  const tasks = [
    { TaskID: 1, TaskTitle: "Easy reading", DifficultyLevel: "Easy", ManualOrder: 1 },
    { TaskID: 2, TaskTitle: "Project work", DifficultyLevel: "Hard", ManualOrder: 2 },
    { TaskID: 3, TaskTitle: "Normal review", DifficultyLevel: "Medium", ManualOrder: 3 },
  ];

  const ordered = LogicToDo.orderTasks(tasks, "High", EnergyLogic);

  assert.deepEqual(
    ordered.map((task) => task.TaskTitle),
    ["Project work", "Normal review", "Easy reading"]
  );
});

test("low energy orders easy tasks first", () => {
  const tasks = [
    { TaskID: 1, TaskTitle: "Project work", DifficultyLevel: "Hard", ManualOrder: 1 },
    { TaskID: 2, TaskTitle: "Easy reading", DifficultyLevel: "Easy", ManualOrder: 2 },
    { TaskID: 3, TaskTitle: "Normal review", DifficultyLevel: "Medium", ManualOrder: 3 },
  ];

  const ordered = LogicToDo.orderTasks(tasks, "Low", EnergyLogic);

  assert.deepEqual(
    ordered.map((task) => task.TaskTitle),
    ["Easy reading", "Normal review", "Project work"]
  );
});

test("task validation rejects blank titles", () => {
  const result = LogicToDo.validateTask({ taskTitle: "   " });

  assert.equal(result.isValid, false);
  assert.equal(result.cleanTask, null);
});

test("task validation cleans a valid task", () => {
  const result = LogicToDo.validateTask({
    taskTitle: "  Finish database report  ",
    taskDescription: "  ERD section  ",
    difficultyLevel: "high",
    dueDate: "2026-05-12",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.cleanTask, {
    taskTitle: "Finish database report",
    taskDescription: "ERD section",
    difficultyLevel: "Hard",
    dueDate: "2026-05-12",
  });
});

test("task filters separate completed and pending tasks", () => {
  const tasks = [
    { TaskID: 1, TaskTitle: "Done", IsCompleted: 1 },
    { TaskID: 2, TaskTitle: "Not done", IsCompleted: 0 },
  ];

  assert.deepEqual(
    LogicToDo.filterTasks(tasks, "Completed").map((task) => task.TaskTitle),
    ["Done"]
  );

  assert.deepEqual(
    LogicToDo.filterTasks(tasks, "Pending").map((task) => task.TaskTitle),
    ["Not done"]
  );
});