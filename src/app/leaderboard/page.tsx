"use client"

import { useEffect, useState } from "react"

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🏆 Leaderboard</h1>

      {data.map((user, i) => (
        <div
          key={i}
          className="flex justify-between border p-4 mb-3 rounded"
        >
          <span>#{i + 1}</span>
          <span>Matches: {user.match_count}</span>
          <span className="text-green-600 font-bold">
            ₹{user.prize}
          </span>
        </div>
      ))}
    </div>
  )
}