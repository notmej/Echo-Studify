import * as SQLite from "expo-sqlite";

let db = null;
let initPromise = null;

async function createTables(database) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS TimerModeSettings (
      SettingID INTEGER PRIMARY KEY CHECK (SettingID = 1),
      TimerMode TEXT NOT NULL,
      CustomDurationMinutes REAL NOT NULL DEFAULT 25,
      PomodoroWorkIntervalMinutes REAL NOT NULL DEFAULT 25,
      PomodoroBreakIntervalMinutes REAL NOT NULL DEFAULT 5,
      PomodoroIntervalCount INTEGER NOT NULL DEFAULT 1,
      UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS TimerDailyStart (
      SessionDate TEXT PRIMARY KEY NOT NULL,
      FirstStartTime TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS TimerSessions (
      SessionID INTEGER PRIMARY KEY AUTOINCREMENT,
      TimerMode TEXT NOT NULL,
      StartTime TEXT NOT NULL,
      EndTime TEXT,
      DurationSeconds INTEGER NOT NULL DEFAULT 0,
      CustomDurationMinutes REAL,
      PomodoroWorkIntervalMinutes REAL,
      PomodoroBreakIntervalMinutes REAL,
      PomodoroIntervalCount INTEGER,
      TimerState TEXT,
      IsActive INTEGER NOT NULL DEFAULT 0,
      FirstStartOfDay TEXT,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS BlockedApps (
      PackageName TEXT PRIMARY KEY NOT NULL,
      AppName TEXT,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS AppBlockState (
      StateID INTEGER PRIMARY KEY CHECK (StateID = 1),
      IsBlocking INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS Streaks (
      StreakID INTEGER PRIMARY KEY CHECK (StreakID = 1),
      CurrentStreak INTEGER NOT NULL DEFAULT 0,
      LastStudyDate TEXT,
      UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO TimerModeSettings (
      SettingID,
      TimerMode,
      CustomDurationMinutes,
      PomodoroWorkIntervalMinutes,
      PomodoroBreakIntervalMinutes,
      PomodoroIntervalCount
    )
    VALUES (1, 'Pomodoro', 25, 25, 5, 1);

    INSERT OR IGNORE INTO AppBlockState (StateID, IsBlocking)
    VALUES (1, 0);

    INSERT OR IGNORE INTO Streaks (StreakID, CurrentStreak, LastStudyDate)
    VALUES (1, 0, NULL);
  `);
}

export async function getStudifyDatabase() {
  if (db) {
    return db;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = SQLite.openDatabaseAsync("studify.db", {
    useNewConnection: true,
  })
    .then(async (database) => {
      await createTables(database);
      db = database;
      return db;
    })
    .catch((error) => {
      console.log("StudifyDatabase init error:", error);
      db = null;
      initPromise = null;
      throw error;
    });

  return initPromise;
}

export async function resetDatabaseConnection() {
  db = null;
  initPromise = null;
}