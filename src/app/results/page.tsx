"use client"

import { useEffect, useState } from "react"

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/winner")
      .then(res => res.json())
      .then(data => setResults(data))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🏆 Results</h1>

      {results.length === 0 && <p>No results yet</p>}

      {results.map((r, i) => (
        <div key={i} className="border p-4 mb-4 rounded">
          <p><b>Matches:</b> {r.match_count}</p>
          <p><b>Numbers:</b> {r.matched_numbers?.join(", ")}</p>
          <p><b>Tier:</b> {r.tier}</p>
          <p className="text-green-600 font-bold">
            ₹{r.prize}
          </p>
        </div>
      ))}
    </div>
  )
}