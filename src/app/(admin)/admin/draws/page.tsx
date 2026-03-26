"use client"

import { useState } from "react"

export default function AdminDrawPage() {
  const [numbers, setNumbers] = useState<number[]>([])
  const [message, setMessage] = useState("")

  const toggleNumber = (num: number) => {
    if (numbers.includes(num)) {
      setNumbers(numbers.filter(n => n !== num))
    } else {
      if (numbers.length >= 5) return
      setNumbers([...numbers, num])
    }
  }

  const createDraw = async () => {
    if (numbers.length !== 5) {
      setMessage("❌ Select exactly 5 numbers")
      return
    }

    const res = await fetch("/api/admin/draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numbers }),
    })

    if (res.ok) {
      setMessage("✅ Draw created!")
      setNumbers([])
    } else {
      setMessage("❌ Failed to create draw")
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        🎯 Create Draw
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-9 gap-2 mb-6">
        {Array.from({ length: 45 }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => toggleNumber(num)}
            className={`p-2 rounded border ${
              numbers.includes(num)
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <p className="mb-4">
        Selected: {numbers.join(", ") || "None"}
      </p>

      <button
        onClick={createDraw}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Create Draw
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}