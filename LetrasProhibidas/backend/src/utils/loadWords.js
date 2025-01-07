import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

export const loadWords = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // NO DEMO
  // const filePath = path.resolve(__dirname, "../dictionaries/spanish_categorizado.json")
  // DEMO
  const filePath = path.resolve(__dirname, "../dictionaries/demo.json")
  const fileContent = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(fileContent)
}