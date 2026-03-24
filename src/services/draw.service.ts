export function generateRandomDraw() {
  const numbers = new Set<number>()

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }

  return Array.from(numbers)
}


export function countMatches(userScores: number[], drawNumbers: number[]) {
  return userScores.filter((n) => drawNumbers.includes(n)).length
}