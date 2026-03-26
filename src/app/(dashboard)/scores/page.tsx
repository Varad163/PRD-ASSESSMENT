"use client"

import { useState } from "react"

export default function ScoresPage() {
  const [scores, setScores] = useState<number[]>([0,0,0,0,0])
  const [dates, setDates] = useState<string[]>(["","","","",""])
  const [msg, setMsg] = useState("")

  const updateScore = (i:number, v:number) => {
    const arr = [...scores]
    arr[i] = v
    setScores(arr)
  }

  const updateDate = (i:number, v:string) => {
    const arr = [...dates]
    arr[i] = v
    setDates(arr)
  }

  const submit = async () => {
    if (scores.some(s => s < 1 || s > 45)) {
      setMsg("Scores must be between 1–45")
      return
    }

    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scores, dates })
    })

    setMsg(res.ok ? "✅ Scores saved!" : "❌ Failed")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">
          ⛳ Enter Your Last 5 Scores
        </h1>

        {scores.map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <input
              type="number"
              placeholder="Score (1-45)"
              className="border p-2 w-1/2"
              onChange={e => updateScore(i, Number(e.target.value))}
            />
            <input
              type="date"
              className="border p-2 w-1/2"
              onChange={e => updateDate(i, e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Submit Scores
        </button>

        <p className="mt-3">{msg}</p>
      </div>
    </div>
  )
}