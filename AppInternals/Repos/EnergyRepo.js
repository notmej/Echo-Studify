import { getStudifyDatabase } from "../Repos/StudifyDatabase";
import EnergyLogic from "../Logic/EnergyLogic";

class EnergyRepo {
  constructor() {
    this.db = null;
    this.currentEnergyLevel = "";
    this.energyDate = null;
    this.repositoryStatus = "not initialized";
  }

  async init() {
    try {
      this.db = await getStudifyDatabase();
      this.repositoryStatus = "ready";
      await this.getTodayEnergyLevel();
      return true;
    } catch (error) {
      this.repositoryStatus = "error";
      console.log("EnergyRepo init error:", error);
      return false;
    }
  }

  async ensureReady() {
    if (!this.db) {
      const isReady = await this.init();

      if (!isReady) {
        throw new Error("EnergyRepo database is not ready.");
      }
    }
  }

  async getTodayEnergyLevel() {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(`
        SELECT EnergyLevel, EnergyDate
        FROM DailyEnergy
        WHERE EnergyID = 1;
      `);

      if (!row || EnergyLogic.isEnergyExpired(row.EnergyDate)) {
        await this.clearEnergyLevel();
        return "";
      }

      this.currentEnergyLevel = EnergyLogic.normalizeEnergyLevel(row.EnergyLevel);
      this.energyDate = row.EnergyDate;
      return this.currentEnergyLevel;
    } catch (error) {
      console.log("EnergyRepo getTodayEnergyLevel error:", error);
      return "";
    }
  }

  async saveTodayEnergyLevel(energyLevel) {
    try {
      await this.ensureReady();

      const normalizedEnergy = EnergyLogic.normalizeEnergyLevel(energyLevel);

      if (!EnergyLogic.isValidEnergyLevel(normalizedEnergy)) {
        return "";
      }

      const today = EnergyLogic.getDateOnly();

      await this.db.runAsync(
        `
        INSERT OR REPLACE INTO DailyEnergy (
          EnergyID,
          EnergyLevel,
          EnergyDate,
          UpdatedAt
        )
        VALUES (1, ?, ?, CURRENT_TIMESTAMP);
        `,
        normalizedEnergy,
        today
      );

      this.currentEnergyLevel = normalizedEnergy;
      this.energyDate = today;

      return this.currentEnergyLevel;
    } catch (error) {
      console.log("EnergyRepo saveTodayEnergyLevel error:", error);
      return "";
    }
  }

  async clearEnergyLevel() {
    try {
      await this.ensureReady();

      await this.db.runAsync(`
        INSERT OR REPLACE INTO DailyEnergy (
          EnergyID,
          EnergyLevel,
          EnergyDate,
          UpdatedAt
        )
        VALUES (1, NULL, NULL, CURRENT_TIMESTAMP);
      `);

      this.currentEnergyLevel = "";
      this.energyDate = null;

      return true;
    } catch (error) {
      console.log("EnergyRepo clearEnergyLevel error:", error);
      return false;
    }
  }
}

const energyRepo = new EnergyRepo();

export default energyRepo;