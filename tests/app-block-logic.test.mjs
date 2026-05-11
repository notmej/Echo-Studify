import test from "node:test";
import assert from "node:assert/strict";
import { loadDefaultExport } from "./hlpr/loadDefaultExport.mjs";

const AppBlockLogic = loadDefaultExport([
  "AppInternals/Logic/AppBlockLogic.js",
  "AppInternals/Logic/AppBlockLogic(2).js",
  "Logic/AppBlockLogic.js",
  "AppBlockLogic.js",
  "AppBlockLogic(2).js",
]);

test("valid app selections produce package names for blocking", () => {
  const result = AppBlockLogic.prepareBlockList([
    { appName: "YouTube", packageName: "com.google.android.youtube" },
    { appName: "Instagram", packageName: "com.instagram.android" },
  ]);

  assert.equal(result.blockList.length, 2);
  assert.deepEqual(result.packageNames, [
    "com.google.android.youtube",
    "com.instagram.android",
  ]);
});

test("invalid package names are rejected", () => {
  const result = AppBlockLogic.prepareBlockList([
    { appName: "Bad App", packageName: "notavalidpackage" },
  ]);

  assert.deepEqual(result.blockList, []);
  assert.deepEqual(result.packageNames, []);
});

test("applyBlockingRules turns blocking on only when apps are valid", () => {
  const result = AppBlockLogic.applyBlockingRules([
    { appName: "TikTok", packageName: "com.zhiliaoapp.musically" },
  ]);

  assert.equal(result.blockingState, true);
  assert.equal(result.blockingRules[0].isBlocked, true);
});

test("clearBlockedApps resets blocking state", () => {
  const result = AppBlockLogic.clearBlockedApps();

  assert.equal(result.blockingState, false);
  assert.deepEqual(result.blockingRules, []);
});