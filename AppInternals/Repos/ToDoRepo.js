import { getStudifyDatabase } from "../Repos/StudifyDatabase";

class ToDoRepo {
  constructor() {
    this.db = null;
    this.taskList = [];
    this.repositoryStatus = "not initialized";
  }

  async init() {
    try {
      this.db = await getStudifyDatabase();
      await this.createTablesIfNeeded();
      this.repositoryStatus = "ready";
      await this.getTasks();
      return true;
    } catch (error) {
      this.repositoryStatus = "error";
      console.log("ToDoRepo init error:", error);
      return false;
    }
  }

  async ensureReady() {
    if (!this.db) {
      const isReady = await this.init();

      if (!isReady) {
        throw new Error("ToDoRepo database is not ready.");
      }
    }

    await this.createTablesIfNeeded();
  }

  async createTablesIfNeeded() {
    if (!this.db) {
      return;
    }

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Tasks (
        TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
        TaskTitle TEXT NOT NULL,
        TaskDescription TEXT,
        DifficultyLevel TEXT,
        DueDate TEXT,
        IsCompleted INTEGER NOT NULL DEFAULT 0,
        ManualOrder INTEGER NOT NULL DEFAULT 0,
        CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        CompletedAt TEXT
      );
    `);
  }

  async getNextManualOrder() {
    await this.ensureReady();

    const row = await this.db.getFirstAsync(`
      SELECT COALESCE(MAX(ManualOrder), 0) + 1 AS NextManualOrder
      FROM Tasks;
    `);

    return row?.NextManualOrder || 1;
  }

  async createTask(task) {
    try {
      await this.ensureReady();

      if (!task || !task.taskTitle) {
        return null;
      }

      const manualOrder = await this.getNextManualOrder();

      const result = await this.db.runAsync(
        `
        INSERT INTO Tasks (
          TaskTitle,
          TaskDescription,
          DifficultyLevel,
          DueDate,
          IsCompleted,
          ManualOrder,
          CreatedAt,
          UpdatedAt
        )
        VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
        [
          task.taskTitle,
          task.taskDescription || null,
          task.difficultyLevel || null,
          task.dueDate || null,
          manualOrder,
        ]
      );

      await this.getTasks();
      return result.lastInsertRowId;
    } catch (error) {
      console.log("ToDoRepo createTask error:", error);
      return null;
    }
  }

  async getTasks(filterOption = "All") {
    try {
      await this.ensureReady();

      let whereClause = "";

      if (filterOption === "Completed") {
        whereClause = "WHERE IsCompleted = 1";
      } else if (filterOption === "Pending") {
        whereClause = "WHERE IsCompleted = 0";
      }

      const rows = await this.db.getAllAsync(`
        SELECT *
        FROM Tasks
        ${whereClause}
        ORDER BY ManualOrder ASC, CreatedAt ASC;
      `);

      this.taskList = rows;
      return rows;
    } catch (error) {
      console.log("ToDoRepo getTasks error:", error);
      return [];
    }
  }

  async updateTask(taskID, task) {
    try {
      await this.ensureReady();

      await this.db.runAsync(
        `
        UPDATE Tasks
        SET
          TaskTitle = ?,
          TaskDescription = ?,
          DifficultyLevel = ?,
          DueDate = ?,
          UpdatedAt = CURRENT_TIMESTAMP
        WHERE TaskID = ?;
        `,
        [
          task.taskTitle,
          task.taskDescription || null,
          task.difficultyLevel || null,
          task.dueDate || null,
          taskID,
        ]
      );

      await this.getTasks();
      return true;
    } catch (error) {
      console.log("ToDoRepo updateTask error:", error);
      return false;
    }
  }

  async toggleTaskCompletion(taskID) {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(
        `
        SELECT IsCompleted
        FROM Tasks
        WHERE TaskID = ?;
        `,
        [taskID]
      );

      if (!row) {
        return false;
      }

      const nextCompletedValue = row.IsCompleted === 1 ? 0 : 1;
      const completedAtValue =
        nextCompletedValue === 1 ? new Date().toISOString() : null;

      await this.db.runAsync(
        `
        UPDATE Tasks
        SET
          IsCompleted = ?,
          CompletedAt = ?,
          UpdatedAt = CURRENT_TIMESTAMP
        WHERE TaskID = ?;
        `,
        [nextCompletedValue, completedAtValue, taskID]
      );

      await this.getTasks();
      return true;
    } catch (error) {
      console.log("ToDoRepo toggleTaskCompletion error:", error);
      return false;
    }
  }

  async deleteTask(taskID) {
    try {
      await this.ensureReady();

      await this.db.runAsync(
        `
        DELETE FROM Tasks
        WHERE TaskID = ?;
        `,
        [taskID]
      );

      await this.getTasks();
      return true;
    } catch (error) {
      console.log("ToDoRepo deleteTask error:", error);
      return false;
    }
  }

  async moveTask(taskID, direction) {
    try {
      await this.ensureReady();

      const currentTask = await this.db.getFirstAsync(
        `
        SELECT TaskID, ManualOrder
        FROM Tasks
        WHERE TaskID = ?;
        `,
        [taskID]
      );

      if (!currentTask) {
        return false;
      }

      let swapTask = null;

      if (direction === "up") {
        swapTask = await this.db.getFirstAsync(
          `
          SELECT TaskID, ManualOrder
          FROM Tasks
          WHERE ManualOrder < ?
          ORDER BY ManualOrder DESC
          LIMIT 1;
          `,
          [currentTask.ManualOrder]
        );
      } else if (direction === "down") {
        swapTask = await this.db.getFirstAsync(
          `
          SELECT TaskID, ManualOrder
          FROM Tasks
          WHERE ManualOrder > ?
          ORDER BY ManualOrder ASC
          LIMIT 1;
          `,
          [currentTask.ManualOrder]
        );
      }

      if (!swapTask) {
        return false;
      }

      await this.db.runAsync(
        `UPDATE Tasks SET ManualOrder = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE TaskID = ?;`,
        [swapTask.ManualOrder, currentTask.TaskID]
      );

      await this.db.runAsync(
        `UPDATE Tasks SET ManualOrder = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE TaskID = ?;`,
        [currentTask.ManualOrder, swapTask.TaskID]
      );

      await this.getTasks();
      return true;
    } catch (error) {
      console.log("ToDoRepo moveTask error:", error);
      return false;
    }
  }

  async clearCompletedTasks() {
    try {
      await this.ensureReady();
      await this.db.runAsync(`DELETE FROM Tasks WHERE IsCompleted = 1;`);
      await this.getTasks();
      return true;
    } catch (error) {
      console.log("ToDoRepo clearCompletedTasks error:", error);
      return false;
    }
  }
}

const toDoRepo = new ToDoRepo();

export default toDoRepo;