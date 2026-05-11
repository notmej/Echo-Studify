import { getStudifyDatabase } from "../Repos/StudifyDatabase";

class AppBlockRepo {
  constructor() {
    this.db = null;

    // Required fields
    this.blockedAppsList = [];
    this.selectedApps = [];
    this.blockingState = false;
    this.repositoryStatus = "not initialized";
  }

  // Creates/opens the local SQLite database on the user's device.
  // This should run when the App Blocking page first opens.
    async init() {
    try {
        this.db = await getStudifyDatabase();

        await this.getBlockedApps();
        await this.getBlockingState();

        this.repositoryStatus = "ready";
        return true;
    } catch (error) {
        this.repositoryStatus = "error";
        console.log("AppBlockRepo init error:", error);
        return false;
    }
    }

  async ensureReady() {
    if (!this.db) {
      const isReady = await this.init();

      if (!isReady) {
        throw new Error("AppBlockRepo database is not ready.");
      }
    }
  }

  // Accepts either an app object or a package name string.
  getPackageName(appOrPackageName) {
    if (typeof appOrPackageName === "string") {
      return appOrPackageName.trim();
    }

    if (appOrPackageName && typeof appOrPackageName.packageName === "string") {
      return appOrPackageName.packageName.trim();
    }

    return "";
  }

  // Basic Android package-name check.
  isValidPackageName(packageName) {
    return (
      typeof packageName === "string" &&
      packageName.trim().length > 0 &&
      packageName.includes(".")
    );
  }

  getCleanPackageNames(appsOrPackageNames) {
    if (!Array.isArray(appsOrPackageNames)) {
      return [];
    }

    const packageNames = appsOrPackageNames
      .map((appOrPackageName) => this.getPackageName(appOrPackageName))
      .filter((packageName) => this.isValidPackageName(packageName));

    // Removes duplicates
    return [...new Set(packageNames)];
  }

  // Saves package names without deleting old ones.
  async saveBlockedApps(appsOrPackageNames) {
    try {
      await this.ensureReady();

      const cleanPackageNames = this.getCleanPackageNames(appsOrPackageNames);

      for (const packageName of cleanPackageNames) {
        await this.db.runAsync(
          `
          INSERT OR IGNORE INTO BlockedApps (PackageName)
          VALUES (?);
          `,
          [packageName]
        );
      }

      await this.getBlockedApps();
      return this.blockedAppsList;
    } catch (error) {
      console.log("saveBlockedApps error:", error);
      return [];
    }
  }

  // Retrieves all blocked package names from SQLite.
  async getBlockedApps() {
    try {
      await this.ensureReady();

      const rows = await this.db.getAllAsync(`
        SELECT PackageName
        FROM BlockedApps
        ORDER BY PackageName ASC;
      `);

      this.blockedAppsList = rows.map((row) => row.PackageName);
      this.selectedApps = this.blockedAppsList;

      return this.blockedAppsList;
    } catch (error) {
      console.log("getBlockedApps error:", error);
      return [];
    }
  }

  // Replaces the saved blocked apps with the current selected apps.
  // Use this when the user presses Save Blocked Apps.
  async updateBlockedApps(appsOrPackageNames) {
    try {
      await this.ensureReady();

      const cleanPackageNames = this.getCleanPackageNames(appsOrPackageNames);

      await this.db.runAsync(`DELETE FROM BlockedApps;`);

      for (const packageName of cleanPackageNames) {
        await this.db.runAsync(
          `
          INSERT OR IGNORE INTO BlockedApps (PackageName)
          VALUES (?);
          `,
          [packageName]
        );
      }

      await this.getBlockedApps();
      return this.blockedAppsList;
    } catch (error) {
      console.log("updateBlockedApps error:", error);
      return [];
    }
  }

  async deleteBlockedApps(appsOrPackageNames) {
    try {
      await this.ensureReady();

      const cleanPackageNames = this.getCleanPackageNames(
        Array.isArray(appsOrPackageNames) ? appsOrPackageNames : [appsOrPackageNames]
      );

      for (const packageName of cleanPackageNames) {
        await this.db.runAsync(
          `
          DELETE FROM BlockedApps
          WHERE PackageName = ?;
          `,
          [packageName]
        );
      }

      await this.getBlockedApps();
      return this.blockedAppsList;
    } catch (error) {
      console.log("deleteBlockedApps error:", error);
      return [];
    }
  }

  async getBlockingState() {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(`
        SELECT IsBlocking
        FROM AppBlockState
        WHERE StateID = 1;
      `);

      this.blockingState = row?.IsBlocking === 1;
      return this.blockingState;
    } catch (error) {
      console.log("getBlockingState error:", error);
      return false;
    }
  }

  async setBlockingState(isBlocking) {
    try {
      await this.ensureReady();

      const value = isBlocking ? 1 : 0;

      await this.db.runAsync(
        `
        UPDATE AppBlockState
        SET IsBlocking = ?
        WHERE StateID = 1;
        `,
        [value]
      );

      this.blockingState = isBlocking;
      return this.blockingState;
    } catch (error) {
      console.log("setBlockingState error:", error);
      return false;
    }
  }

  async countBlockedApps() {
    try {
      await this.ensureReady();

      const row = await this.db.getFirstAsync(`
        SELECT COUNT(*) AS TotalPackages
        FROM BlockedApps;
      `);

      return row?.TotalPackages ?? 0;
    } catch (error) {
      console.log("countBlockedApps error:", error);
      return 0;
    }
  }

  async clearBlockedApps() {
    try {
      await this.ensureReady();

      await this.db.runAsync(`DELETE FROM BlockedApps;`);
      await this.setBlockingState(false);

      this.blockedAppsList = [];
      this.selectedApps = [];
      this.blockingState = false;

      return true;
    } catch (error) {
      console.log("clearBlockedApps error:", error);
      return false;
    }
  }
}

const appBlockRepo = new AppBlockRepo();

export default appBlockRepo;