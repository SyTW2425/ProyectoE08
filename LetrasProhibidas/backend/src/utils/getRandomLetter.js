export const getRandomLetter = (currentLetters = []) => {
  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("")
  const availableLetters = alphabet.filter((letter) => !currentLetters.includes(letter))

  const index = Math.floor(Math.random() * availableLetters.length)
  return availableLetters[index]
}