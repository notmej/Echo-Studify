import { getStudifyDatabase } from "../Repos/StudifyDatabase";

const MIN_STOPWATCH_SESSION_SECONDS = 10 * 60;

class TimerRepo {
  constructor() {
    this.db = null;

    this.sessionList = [];
    this.activeSession = null;
    this.timerState = null;
    this.startTime = null;
    this.endTime = null;
    this.repositoryStatus = "not initialized";
  }

  async init() {
    try {
      this.db = await getStudifyDatabase();

      this.repositoryStatus = "ready";
      await this.getActiveSession();
      await this.getSessionHistory();

      return true;
    } catch (error) {
      this.repositoryStatus = "error";
      console.log("TimerRepo init error:", error);
      return false;
    }
  }

  async ensureReady() {
    if (!this.db) {
      await this.init();
    }

    if (!this.db) {
      throw new Error("TimerRepo database is not ready.");
    }
  }

  getDateOnly(dateObject) {
    return dateObject.toISOString().split("T")[0];
  }

  getSessionDurationSeconds(finalTimerState, activeSession, now) {
    const elapsedSeconds = Number(finalTimerState?.elapsedSeconds);

    if (!Number.isNaN(elapsedSeconds) && elapsedSeconds >= 0) {
      return Math.floor(elapsedSeconds);
    }

    return Math.max(
      0,
      Math.floor(
        (now.getTime() - new Date(activeSession.StartTime).getTime()) / 1000
      )
    );
  }

  shouldFinalStateCountAsStudySession(finalTimerState, durationSeconds) {
    if (!finalTimerState) {
      return false;
    }

    if (finalTimerState.modeName === "Stopwatch") {
      return (
        finalTimerState.wasStoppedManually === true &&
        Number(durationSeconds) >= MIN_STOPWATCH_SESSION_SECONDS
      );
    }

    return (
      finalTimerState.isCompleted === true &&
      finalTimerState.wasStoppedManually !== true
    );
  }

  async getFirstStartOfDay(now) {
    await this.ensureReady();

    const sessionDate = this.getDateOnly(now);

    let dailyStartRow = await this.db.getFirstAsync(
      `
      SELECT FirstStartTime
      FROM TimerDailyStart
      WHERE SessionDate = ?;
      `,
      sessionDate
    );

    if (!dailyStartRow) {
      await this.db.runAsync(
        `
        INSERT INTO TimerDailyStart (SessionDate, FirstStartTime)
        VALUES (?, ?);
        `,
        sessionDate,
        now.toISOString()
      );

      dailyStartRow = {
        FirstStartTime: now.toISOString(),
      };
    }

    return dailyStartRow.FirstStartTime;
  }

  async saveModeSelection(modeSelection) {
    try {
      await this.ensureReady();

      if (!modeSelection) {
        throw new Error("No mode selection was provided.");
      }

      const selectedMode = modeSelection.selectedMode;

      const timerMode =
        typeof selectedMode === "string"
          ? selectedMode
          : selectedMode?.modeName || "Pomodoro";

      const customDuration = Number(modeSelection.customDuration) || 20;
      const pomodoroWorkInterval =
        Number(modeSelection.pomodoroWorkInterval) || 25;
      const pomodoroBreakInterval =
        Number(modeSelection.pomodoroBreakInterval) || 5;
      const pomodoroIntervalCount =
        Number(modeSelection.pomodoroIntervalCount) || 1;

      await this.db.runAsync(
        `
        INSERT OR REPLACE INTO TimerModeSettings (
          SettingID,
          TimerMode,
          CustomDurationMinutes,
          PomodoroWorkIntervalMinutes,
          PomodoroBreakIntervalMinutes,
          PomodoroIntervalCount,
          UpdatedAt
        )
        VALUES (1, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
        `,
        timerMode,
        customDuration,
        pomodoroWorkInterval,
        pomodoroBreakInterval,
        pomodoroIntervalCount
      );

      return true;
    } catch (error) {
      console.log("TimerRepo saveModeSelection error:", error);
      return false;
    }
  }

  async getModeSelection() {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(`
        SELECT
          TimerMode,
          CustomDurationMinutes,
          PomodoroWorkIntervalMinutes,
          PomodoroBreakIntervalMinutes,
          PomodoroIntervalCount
        FROM TimerModeSettings
        WHERE SettingID = 1;
      `);

      if (!row) {
        return null;
      }

      return {
        selectedMode: row.TimerMode,
        customDuration: String(row.CustomDurationMinutes),
        pomodoroWorkInterval: String(row.PomodoroWorkIntervalMinutes),
        pomodoroBreakInterval: String(row.PomodoroBreakIntervalMinutes),
        pomodoroIntervalCount: row.PomodoroIntervalCount,
      };
    } catch (error) {
      console.log("TimerRepo getModeSelection error:", error);
      return null;
    }
  }

  async saveSession(session) {
    try {
      await this.ensureReady();

      const result = await this.db.runAsync(
        `
        INSERT INTO TimerSessions (
          TimerMode,
          StartTime,
          EndTime,
          DurationSeconds,
          CustomDurationMinutes,
          PomodoroWorkIntervalMinutes,
          PomodoroBreakIntervalMinutes,
          PomodoroIntervalCount,
          TimerState,
          IsActive,
          SessionCountsTowardStreak,
          FirstStartOfDay
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        session.timerMode,
        session.startTime,
        session.endTime || null,
        Number(session.durationSeconds) || 0,
        Number(session.customDuration) || 0,
        Number(session.pomodoroWorkInterval) || 0,
        Number(session.pomodoroBreakInterval) || 0,
        Number(session.pomodoroIntervalCount) || 0,
        JSON.stringify(session.timerState || {}),
        session.isActive ? 1 : 0,
        session.sessionCountsTowardStreak ? 1 : 0,
        session.firstStartOfDay || null
      );

      await this.getSessionHistory();

      return result.lastInsertRowId;
    } catch (error) {
      console.log("TimerRepo saveSession error:", error);
      return null;
    }
  }

  async startSession(modeSelection, initialTimerState) {
    try {
      await this.ensureReady();

      await this.clearActiveSession();

      const now = new Date();
      const firstStartOfDay = await this.getFirstStartOfDay(now);
      const selectedMode = modeSelection.selectedMode;

      const timerMode =
        typeof selectedMode === "string"
          ? selectedMode
          : selectedMode?.modeName || "Pomodoro";

      const newSession = {
        timerMode,
        startTime: initialTimerState?.startedAt || now.toISOString(),
        endTime: null,
        durationSeconds: 0,
        customDuration: Number(modeSelection.customDuration) || 0,
        pomodoroWorkInterval: Number(modeSelection.pomodoroWorkInterval) || 0,
        pomodoroBreakInterval: Number(modeSelection.pomodoroBreakInterval) || 0,
        pomodoroIntervalCount: Number(modeSelection.pomodoroIntervalCount) || 0,
        timerState: initialTimerState,
        isActive: true,
        sessionCountsTowardStreak: false,
        firstStartOfDay,
      };

      const sessionID = await this.saveSession(newSession);

      this.activeSession = {
        SessionID: sessionID,
        ...newSession,
      };

      this.startTime = newSession.startTime;
      this.timerState = initialTimerState;
      this.repositoryStatus = "active session started";

      return this.activeSession;
    } catch (error) {
      console.log("TimerRepo startSession error:", error);
      this.repositoryStatus = "error";
      return null;
    }
  }

  async stopSession(finalTimerState) {
    try {
      await this.ensureReady();

      const activeSession = await this.getActiveSession();

      if (!activeSession) {
        return null;
      }

      const now = new Date();
      const durationSeconds = this.getSessionDurationSeconds(
        finalTimerState,
        activeSession,
        now
      );

      const shouldCountAsStudySession =
        this.shouldFinalStateCountAsStudySession(finalTimerState, durationSeconds);

      if (!shouldCountAsStudySession) {
        await this.clearActiveSession();
        return false;
      }

      await this.db.runAsync(
        `
        UPDATE TimerSessions
        SET
          EndTime = ?,
          DurationSeconds = ?,
          TimerState = ?,
          IsActive = 0,
          SessionCountsTowardStreak = 1
        WHERE SessionID = ?;
        `,
        now.toISOString(),
        Number(durationSeconds) || 0,
        JSON.stringify(finalTimerState || {}),
        activeSession.SessionID
      );

      this.endTime = now.toISOString();
      this.timerState = finalTimerState || null;
      this.activeSession = null;
      this.repositoryStatus = "active session completed";

      await this.getSessionHistory();

      return true;
    } catch (error) {
      console.log("TimerRepo stopSession error:", error);
      this.repositoryStatus = "error";
      return false;
    }
  }

  async updateTimerState(timerState) {
    try {
      await this.ensureReady();

      const activeSession = await this.getActiveSession();

      if (!activeSession) {
        return false;
      }

      await this.db.runAsync(
        `
        UPDATE TimerSessions
        SET
          TimerState = ?,
          DurationSeconds = ?
        WHERE SessionID = ?;
        `,
        JSON.stringify(timerState || {}),
        Number(timerState?.elapsedSeconds) || 0,
        activeSession.SessionID
      );

      this.timerState = timerState;
      return true;
    } catch (error) {
      console.log("TimerRepo updateTimerState error:", error);
      return false;
    }
  }

  async getActiveSession() {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(`
        SELECT *
        FROM TimerSessions
        WHERE IsActive = 1
        ORDER BY SessionID DESC
        LIMIT 1;
      `);

      if (!row) {
        this.activeSession = null;
        return null;
      }

      this.activeSession = row;

      try {
        this.timerState = row.TimerState ? JSON.parse(row.TimerState) : null;
      } catch {
        this.timerState = null;
      }

      return row;
    } catch (error) {
      console.log("TimerRepo getActiveSession error:", error);
      return null;
    }
  }

  async getSessionHistory() {
    try {
      await this.ensureReady();

      const rows = await this.db.getAllAsync(`
        SELECT *
        FROM TimerSessions
        WHERE IsActive = 0
          AND SessionCountsTowardStreak = 1
        ORDER BY StartTime DESC;
      `);

      this.sessionList = rows;
      return this.sessionList;
    } catch (error) {
      console.log("TimerRepo getSessionHistory error:", error);
      return [];
    }
  }

  async clearActiveSession() {
    try {
      await this.ensureReady();

      await this.db.runAsync(`
        DELETE FROM TimerSessions
        WHERE IsActive = 1;
      `);

      this.activeSession = null;
      this.timerState = null;

      await this.getSessionHistory();

      return true;
    } catch (error) {
      console.log("TimerRepo clearActiveSession error:", error);
      return false;
    }
  }

  async clearSessionHistory() {
    try {
      await this.ensureReady();

      await this.db.runAsync(`DELETE FROM TimerSessions;`);

      this.sessionList = [];
      this.activeSession = null;
      this.timerState = null;

      return true;
    } catch (error) {
      console.log("TimerRepo clearSessionHistory error:", error);
      return false;
    }
  }
}

const timerRepo = new TimerRepo();

export default timerRepo;