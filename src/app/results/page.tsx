"use client"

import { useEffect, useState } from "react"

type Result = {
  id: string
  email: string
  drawId: string
  matches: number
  tier: string
  prize: number
  status: string
  date: string
}

export default function ResultPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/result")
        const data = await res.json()

        console.log("RESULTS:", data)

        setResults(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return <p className="p-6">Loading results...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">🎯 Your Results</h1>

        {/* No Results */}
        {results.length === 0 ? (
          <p className="text-gray-500">No results found</p>
        ) : (
          <div className="space-y-4">

            {results.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow p-5 border"
              >
                <div className="flex justify-between items-center">

                  {/* LEFT */}
                  <div>
                    <p className="font-semibold text-lg">
                      🎯 Draw: {r.drawId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Matches: {r.matches}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{r.prize}
                    </p>
                    <p className="text-sm">{r.tier}</p>
                  </div>

                </div>

                {/* Bottom */}
                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>
                    Status:{" "}
                    <span className={`px-2 py-1 rounded ${
                      r.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status}
                    </span>
                  </span>

                  <span>
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}