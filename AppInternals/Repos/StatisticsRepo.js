import { getStudifyDatabase } from "../Repos/StudifyDatabase";
import timerRepo from "../Repos/TimerRepo";

class StatisticsRepo {
  constructor() {
    this.db = null;
    this.repositoryStatus = "not initialized";
  }

  async init() {
    try {
      this.db = await getStudifyDatabase();

      if (timerRepo.repositoryStatus !== "ready") {
        await timerRepo.init();
      }

      this.repositoryStatus = "ready";
      return true;
    } catch (error) {
      this.repositoryStatus = "error";
      console.log("StatisticsRepo init error:", error);
      return false;
    }
  }

  async ensureReady() {
    if (!this.db) {
      const isReady = await this.init();

      if (!isReady) {
        throw new Error("StatisticsRepo database is not ready.");
      }
    }
  }

  getStartOfDay(dateObject) {
    const date = new Date(dateObject);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getEndOfDay(dateObject) {
    const date = this.getStartOfDay(dateObject);
    date.setDate(date.getDate() + 1);
    return date;
  }

  getStartOfWeek(dateObject) {
    const date = this.getStartOfDay(dateObject);
    const dayIndex = date.getDay(); // Sunday = 0
    date.setDate(date.getDate() - dayIndex);
    return date;
  }

  getEndOfWeek(dateObject) {
    const date = this.getStartOfWeek(dateObject);
    date.setDate(date.getDate() + 7);
    return date;
  }

  getStartOfMonth(dateObject) {
    return new Date(dateObject.getFullYear(), dateObject.getMonth(), 1, 0, 0, 0, 0);
  }

  getEndOfMonth(dateObject) {
    return new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1, 0, 0, 0, 0);
  }

  getStartOfYear(dateObject) {
    return new Date(dateObject.getFullYear(), 0, 1, 0, 0, 0, 0);
  }

  getEndOfYear(dateObject) {
    return new Date(dateObject.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
  }

  getSecondsBetween(startDate, endDate) {
    return Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
  }

  getSessionEndTime(session) {
    if (session.EndTime) {
      return new Date(session.EndTime);
    }

    const startDate = new Date(session.StartTime);
    const durationSeconds = Number(session.DurationSeconds) || 0;

    return new Date(startDate.getTime() + durationSeconds * 1000);
  }

  getOverlapSeconds(sessionStart, sessionEnd, bucketStart, bucketEnd) {
    const overlapStart = Math.max(sessionStart.getTime(), bucketStart.getTime());
    const overlapEnd = Math.min(sessionEnd.getTime(), bucketEnd.getTime());

    if (overlapEnd <= overlapStart) {
      return 0;
    }

    return Math.floor((overlapEnd - overlapStart) / 1000);
  }

  formatHours(seconds) {
    const hours = Number(seconds || 0) / 3600;

    if (hours === 0) {
      return "0h";
    }

    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }

    return `${hours.toFixed(1)}h`;
  }

  getMonthShortName(monthIndex) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months[monthIndex];
  }

  getBucketsForPeriod(period) {
    const now = new Date();
    const buckets = [];

    if (period === "day") {
      const dayStart = this.getStartOfDay(now);

      for (let hour = 0; hour < 24; hour += 2) {
        const bucketStart = new Date(dayStart);
        bucketStart.setHours(hour, 0, 0, 0);

        const bucketEnd = new Date(dayStart);
        bucketEnd.setHours(hour + 2, 0, 0, 0);

        buckets.push({
          label: `${hour}-${hour + 2}`,
          startDate: bucketStart,
          endDate: bucketEnd,
          maxSeconds: 2 * 60 * 60,
        });
      }

      return {
        title: "Today",
        period,
        rangeStart: dayStart,
        rangeEnd: this.getEndOfDay(now),
        buckets,
      };
    }

    if (period === "week") {
      const weekStart = this.getStartOfWeek(now);
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let day = 0; day < 7; day += 1) {
        const bucketStart = new Date(weekStart);
        bucketStart.setDate(weekStart.getDate() + day);

        const bucketEnd = new Date(bucketStart);
        bucketEnd.setDate(bucketStart.getDate() + 1);

        buckets.push({
          label: dayLabels[day],
          startDate: bucketStart,
          endDate: bucketEnd,
          maxSeconds: 24 * 60 * 60,
        });
      }

      return {
        title: "This Week",
        period,
        rangeStart: weekStart,
        rangeEnd: this.getEndOfWeek(now),
        buckets,
      };
    }

    if (period === "month") {
      const monthStart = this.getStartOfMonth(now);
      const monthEnd = this.getEndOfMonth(now);

      const monthYear = monthStart.getFullYear();
      const monthIndex = monthStart.getMonth();
      const lastDayOfMonth = new Date(monthYear, monthIndex + 1, 0).getDate();

      const weekRanges = [
        { label: "Week 1", startDay: 1, endDay: 8 },
        { label: "Week 2", startDay: 8, endDay: 15 },
        { label: "Week 3", startDay: 15, endDay: 22 },
        { label: "Week 4", startDay: 22, endDay: lastDayOfMonth + 1 },
      ];

      for (const weekRange of weekRanges) {
        const bucketStart = new Date(monthYear, monthIndex, weekRange.startDay, 0, 0, 0, 0);
        const bucketEnd = new Date(monthYear, monthIndex, weekRange.endDay, 0, 0, 0, 0);

        buckets.push({
          label: weekRange.label,
          startDate: bucketStart,
          endDate: bucketEnd,
          maxSeconds: this.getSecondsBetween(bucketStart, bucketEnd),
        });
      }

      return {
        title: "This Month",
        period,
        rangeStart: monthStart,
        rangeEnd: monthEnd,
        buckets,
      };
    }

    const yearStart = this.getStartOfYear(now);
    const yearEnd = this.getEndOfYear(now);
    const year = yearStart.getFullYear();

    for (let month = 0; month < 12; month += 1) {
      const bucketStart = new Date(year, month, 1, 0, 0, 0, 0);
      const bucketEnd = new Date(year, month + 1, 1, 0, 0, 0, 0);

      buckets.push({
        label: this.getMonthShortName(month),
        startDate: bucketStart,
        endDate: bucketEnd,
        maxSeconds: this.getSecondsBetween(bucketStart, bucketEnd),
      });
    }

    return {
      title: "This Year",
      period: "year",
      rangeStart: yearStart,
      rangeEnd: yearEnd,
      buckets,
    };
  }

  async getCompletedFocusSessions() {
    try {
      await this.ensureReady();

      const sessions = await timerRepo.getSessionHistory();

      return sessions.filter((session) => {
        const durationSeconds = Number(session.DurationSeconds) || 0;
        return durationSeconds > 0 && session.StartTime;
      });
    } catch (error) {
      console.log("StatisticsRepo getCompletedFocusSessions error:", error);
      return [];
    }
  }

  async getCurrentStreak() {
    try {
      await this.ensureReady();

      return await timerRepo.getCurrentStreak();
    } catch (error) {
      console.log("StatisticsRepo getCurrentStreak error:", error);
      return 0;
    }
  }

  buildPeriodStatistics(period, sessions) {
    const periodInfo = this.getBucketsForPeriod(period);

    const bucketsWithSeconds = periodInfo.buckets.map((bucket) => {
      let totalSeconds = 0;
      let sessionCount = 0;

      for (const session of sessions) {
        const sessionStart = new Date(session.StartTime);
        const sessionEnd = this.getSessionEndTime(session);

        const overlapSeconds = this.getOverlapSeconds(
          sessionStart,
          sessionEnd,
          bucket.startDate,
          bucket.endDate
        );

        if (overlapSeconds > 0) {
          totalSeconds += overlapSeconds;
          sessionCount += 1;
        }
      }

      const percentage =
        bucket.maxSeconds > 0
          ? Math.min(100, Math.round((totalSeconds / bucket.maxSeconds) * 100))
          : 0;

      return {
        label: bucket.label,
        seconds: totalSeconds,
        hoursLabel: this.formatHours(totalSeconds),
        percentage,
        sessionCount,
      };
    });

    const periodTotalSeconds = bucketsWithSeconds.reduce(
      (sum, bucket) => sum + bucket.seconds,
      0
    );

    const sessionsInsidePeriod = sessions.filter((session) => {
      const sessionStart = new Date(session.StartTime);
      const sessionEnd = this.getSessionEndTime(session);

      return (
        sessionEnd > periodInfo.rangeStart &&
        sessionStart < periodInfo.rangeEnd
      );
    });

    return {
      period: periodInfo.period,
      title: periodInfo.title,
      rangeStart: periodInfo.rangeStart.toISOString(),
      rangeEnd: periodInfo.rangeEnd.toISOString(),
      buckets: bucketsWithSeconds,
      periodTotalSeconds,
      periodStudyHoursLabel: this.formatHours(periodTotalSeconds),
      periodSessionCount: sessionsInsidePeriod.length,
    };
  }




    async getStatisticsDashboardData() {
        try {
            await this.ensureReady();

            const sessions = await this.getCompletedFocusSessions();
            const currentStreak = await this.getCurrentStreak();

            const totalStudySeconds = sessions.reduce((sum, session) => {
                return sum + (Number(session.DurationSeconds) || 0);
            }, 0);

            const periods = {
                day: this.buildPeriodStatistics("day", sessions),
                week: this.buildPeriodStatistics("week", sessions),
                month: this.buildPeriodStatistics("month", sessions),
                year: this.buildPeriodStatistics("year", sessions),
            };

            return {
                totalSessions: sessions.length,
                currentStreak,
                totalStudySeconds,
                totalStudyHoursLabel: this.formatHours(totalStudySeconds),
                periods,
            };
        } catch (error) {
            console.log("StatisticsRepo getStatisticsDashboardData error:", error);

            return {
                totalSessions: 0,
                currentStreak: 0,
                totalStudySeconds: 0,
                totalStudyHoursLabel: "0h",
                periods: {
                day: this.buildPeriodStatistics("day", []),
                week: this.buildPeriodStatistics("week", []),
                month: this.buildPeriodStatistics("month", []),
                year: this.buildPeriodStatistics("year", []),
                },
            };
        }
    }
}

const statisticsRepo = new StatisticsRepo();

export default statisticsRepo;