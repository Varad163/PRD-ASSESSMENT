"use client"

import { useEffect, useState } from "react"

export default function ScoresPage() {
  const [scores, setScores] = useState<any[]>([])
  const [value, setValue] = useState("")
  const [date, setDate] = useState("")

  const fetchScores = async () => {
    const res = await fetch("/api/scores")
    const data = await res.json()
    setScores(data.scores || [])
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const handleAdd = async () => {
    await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: Number(value),
        played_at: date,
      }),
    })

    setValue("")
    setDate("")
    fetchScores()
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Your Scores</h1>

      {/* Add Score */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Score (1-45)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="p-2 text-black"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 text-black"
        />
        <button onClick={handleAdd} className="bg-blue-500 p-2">
          Add
        </button>
      </div>

      {/* Scores List */}
      <ul className="space-y-2">
        {scores.map((s) => (
          <li key={s.id} className="border p-2">
            Score: {s.value} | Date: {s.played_at}
          </li>
        ))}
      </ul>
    </div>
  )
}