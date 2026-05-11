import fs from "node:fs";
import path from "node:path";

function findExistingPath(possiblePaths) {
  for (const relativePath of possiblePaths) {
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  throw new Error(
    "Could not find source file. Tried:\n" + possiblePaths.join("\n")
  );
}

export function loadDefaultExport(possiblePaths) {
  const sourcePath = findExistingPath(possiblePaths);
  const sourceCode = fs.readFileSync(sourcePath, "utf8");

  if (!sourceCode.includes("export default")) {
    throw new Error(sourcePath + " does not contain export default.");
  }

  const runnableCode = sourceCode.replace(/export\s+default\s+/, "return ");

  try {
    const factory = new Function(runnableCode);
    return factory();
  } catch (error) {
    throw new Error(
      "Could not load " +
        sourcePath +
        ". These terminal tests are meant for plain logic files with no React Native or Expo imports. Original error: " +
        error.message
    );
  }
}