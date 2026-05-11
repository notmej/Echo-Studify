const ENERGY_LEVELS = ["High", "Medium", "Low"];

function getDateOnly(dateObject = new Date()) {
  return dateObject.toISOString().split("T")[0];
}

function normalizeEnergyLevel(energyLevel) {
  if (!energyLevel) {
    return "";
  }

  const cleanValue = String(energyLevel).trim().toLowerCase();

  if (cleanValue === "high" || cleanValue === "hard") {
    return "High";
  }

  if (cleanValue === "medium" || cleanValue === "med") {
    return "Medium";
  }

  if (cleanValue === "low" || cleanValue === "easy") {
    return "Low";
  }

  return "";
}

function isValidEnergyLevel(energyLevel) {
  return ENERGY_LEVELS.includes(normalizeEnergyLevel(energyLevel));
}

function getTaskOrderForEnergy(energyLevel) {
  const normalizedEnergy = normalizeEnergyLevel(energyLevel);

  if (normalizedEnergy === "Low") {
    return ["Easy", "Medium", "Hard"];
  }

  if (normalizedEnergy === "Medium") {
    return ["Medium", "Hard", "Easy"];
  }

  if (normalizedEnergy === "High") {
    return ["Hard", "Medium", "Easy"];
  }

  return [];
}

function isEnergyExpired(energyDate, nowDateObject = new Date()) {
  if (!energyDate) {
    return true;
  }

  return energyDate !== getDateOnly(nowDateObject);
}

export default {
  ENERGY_LEVELS,
  getDateOnly,
  normalizeEnergyLevel,
  isValidEnergyLevel,
  getTaskOrderForEnergy,
  isEnergyExpired,
};