export const getRandomLetter = (currentLetters = null) => {
  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  if (currentLetters === null) {
    const index = Math.floor(Math.random() * alphabet.length);
    return alphabet[index];
  } else {
    // Si se pasa un array, filtrar las letras disponibles
    const availableLetters = alphabet.filter((letter) => !currentLetters.includes(letter));
    const index = Math.floor(Math.random() * availableLetters.length);
    return availableLetters[index];
  }
};