import { useEffect, useState } from "react";

import EnergyLogic from "../Logic/EnergyLogic";
import EnergyRepo from "../Repos/EnergyRepo";

export default function ViewModelEnergy() {
  const [dailyEnergyLevel, setDailyEnergyLevel] = useState("");
  const [energyStatusMessage, setEnergyStatusMessage] = useState(
    "Choose your energy level for today."
  );

  useEffect(() => {
    initializeEnergy();
  }, []);

  async function initializeEnergy() {
    await EnergyRepo.init();
    const todayEnergy = await EnergyRepo.getTodayEnergyLevel();

    setDailyEnergyLevel(todayEnergy);

    if (todayEnergy) {
      setEnergyStatusMessage("Today's energy level: " + todayEnergy);
    } else {
      setEnergyStatusMessage("Choose your energy level for today.");
    }
  }

  async function saveDailyEnergyLevel(energyLevel) {
    const normalizedEnergy = EnergyLogic.normalizeEnergyLevel(energyLevel);

    if (!EnergyLogic.isValidEnergyLevel(normalizedEnergy)) {
      setEnergyStatusMessage("Please choose High, Medium, or Low energy.");
      return "";
    }

    const savedEnergy = await EnergyRepo.saveTodayEnergyLevel(normalizedEnergy);
    setDailyEnergyLevel(savedEnergy);

    if (savedEnergy) {
      setEnergyStatusMessage("Today's energy level saved: " + savedEnergy);
    }

    return savedEnergy;
  }

  async function clearDailyEnergyLevel() {
    await EnergyRepo.clearEnergyLevel();
    setDailyEnergyLevel("");
    setEnergyStatusMessage("Energy level cleared.");
  }

  function getEnergyOptions() {
    return EnergyLogic.ENERGY_LEVELS;
  }

  return {
    dailyEnergyLevel,
    energyStatusMessage,
    initializeEnergy,
    saveDailyEnergyLevel,
    clearDailyEnergyLevel,
    getEnergyOptions,
  };
}