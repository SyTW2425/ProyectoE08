import fs from "fs"

const normalizeWord = (word) => {
  return word
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
}

const fileContent = fs.readFileSync("./dictionaries/spanish_categorizado.json", "utf-8")
const content = JSON.parse(fileContent)
const updatedContent = content.map((word) => {
  word.lemma = normalizeWord(word.lemma)
  return word
})

const contentToWrite = JSON.stringify(updatedContent, null, 2)
fs.writeFileSync("./dictionaries/spanish_categorizado.json", contentToWrite)

