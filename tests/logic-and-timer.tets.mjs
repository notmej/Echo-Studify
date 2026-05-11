import test from "node:test";
import assert from "node:assert/strict";
import { loadDefaultExport } from "./hlpr/loadDefaultExport.mjs";

const LogicTimer = loadDefaultExport([
  "AppInternals/Logic/LogicTimer.js",
  "AppInternals/Logic/LogicTimer(9).js",
  "Logic/LogicTimer.js",
  "LogicTimer.js",
  "LogicTimer(9).js",
]);

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

test("Stopwatch starts at 0 and has no selected end duration", () => {
  const state = LogicTimer.createInitialTimerState ({
    selectedMode: { modeID: 3,modeName: "Stopwatch" },
    customDuration: 999,
  });

  assert.equal( state.modeName, "Stopwatch");
  assert.equal(state.isRunning,true);
  assert.equal( state.isCompleted,false);
  assert.equal (state.elapsedSeconds, 0);
  assert.equal( state.remainingSeconds,0);
  assert.equal( state.totalDurationSeconds,0);});

test("stopwatch keeps running indefinitely instead of auto-completing", () => {
  const startDate = new Date("2026-05-11T10:00:00.000Z");
  const twoHoursLater = new Date("2026-05-11T12:00:00.000Z");

  const state = {
    modeName: "Stopwatch",
    isRunning: true,
    isCompleted: false,
    wasStoppedManually: false,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    totalDurationSeconds: 0,
    startedAt: startDate.toISOString(),
    updatedAt: startDate.toISOString(),
  };

  const nextState = LogicTimer.getTimerStateFromClock(state, twoHoursLater);

  assert.equal(nextState.elapsedSeconds, 7200);
  assert.equal(nextState.isRunning,true);
  assert.equal( nextState.isCompleted,false);
  assert.equal(nextState.remainingSeconds,0);
});

test("Stopwatch under 10 minutes does not count as a saved session", () => {
  const stoppedState = LogicTimer.stopTimerManually({
    modeName: "Stopwatch",
    isRunning:true, isCompleted: false,
    wasStoppedManually: false,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    totalDurationSeconds: 0,
    startedAt: minutesAgo(9),
    updatedAt: minutesAgo(9),});

  assert.equal(stoppedState.isRunning, false);
  assert.equal(stoppedState.wasStoppedManually, true);
  assert.equal(LogicTimer.isStopwatchSessionLongEnough(stoppedState), false);
  assert.equal(LogicTimer.shouldSaveSession(stoppedState), false);
});

test("Stopwatch at 10 minutes or more counts as a saved session after manual stop", () => {
  const stoppedState = LogicTimer.stopTimerManually({
    modeName: "Stopwatch",
    isRunning: true,
    isCompleted: false,
    wasStoppedManually: false,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    totalDurationSeconds: 0,
    startedAt: minutesAgo(11),
    updatedAt: minutesAgo(11),});

  assert.ok(stoppedState.elapsedSeconds >= LogicTimer.MIN_STOPWATCH_SESSION_SECONDS);
  assert.equal(LogicTimer.isStopwatchSessionLongEnough(stoppedState), true);
  assert.equal(LogicTimer.shouldSaveSession(stoppedState), true);
});

test("Timer mode completes and is saveable only when it reaches zero", () => {
  const startDate = new Date("2026-05-11T10:00:00.000Z");
  const oneMinuteLater = new Date("2026-05-11T10:01:00.000Z");

  const state = {
    modeName: "Timer",
    isRunning: true,
    isCompleted: false,
    wasStoppedManually: false,
    elapsedSeconds: 0,
    remainingSeconds: 60,
    totalDurationSeconds: 60,
    startedAt: startDate.toISOString(),
    updatedAt: startDate.toISOString(),};

  const nextState = LogicTimer.getTimerStateFromClock(state, oneMinuteLater);

  assert.equal(nextState.remainingSeconds, 0);
  assert.equal(nextState.isRunning, false);
  assert.equal(nextState.isCompleted, true);
  assert.equal(LogicTimer.shouldSaveSession(nextState), true);
});

test("formatSeconds displays mm:ss before 1 hour and hh:mm:ss after 1 hour", () => {
  assert.equal(LogicTimer.formatSeconds(65), "01:05");
  assert.equal(LogicTimer.formatSeconds(3661), "01:01:01");});