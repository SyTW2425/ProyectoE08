export const checkWord = (words, wordToCheck, category) => {
  // Primero hay que eliminar mayusculas, tildes, etc
  const normalizedWord = normalizeWord(wordToCheck)
  // Buscar en la lista de palabras la palabra viendo si coincide con la categoria
  const wordFound = words.find((word) => word.lemma === normalizedWord)
  // Una vez tenemos la palabra, comprobar en la misma si dentro del array de categorias, se encuentra category
  if (wordFound) {
    return wordFound.category.includes(category)
  }
  return false
}

const normalizeWord = (word) => {
  return word
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
}