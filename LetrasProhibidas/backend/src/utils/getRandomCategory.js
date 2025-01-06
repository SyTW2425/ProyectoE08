import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";


export const getRandomCategory = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // NO DEMO
  // const filePath = path.resolve(__dirname, "../dictionaries/categories.json")
  // DEMO
  const filePath = path.resolve(__dirname, "../dictionaries/demoCategories.json")
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const categories = JSON.parse(fileContent)
  return (categories[Math.floor(Math.random() * categories.length)])
}