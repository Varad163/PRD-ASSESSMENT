export function calculatePrizePool(totalUsers: number, price: number) {
  return totalUsers * price
}

export function splitPrizePool(totalPool: number) {
  return {
    tier5: totalPool * 0.4,
    tier4: totalPool * 0.35,
    tier3: totalPool * 0.25,
  }
}