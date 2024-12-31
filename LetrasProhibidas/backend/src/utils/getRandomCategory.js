import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";


export const getRandomCategory = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, "../dictionaries/categories.json")
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const categories = JSON.parse(fileContent)
  return (categories[Math.floor(Math.random() * categories.length)])
}