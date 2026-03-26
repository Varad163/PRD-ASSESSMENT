"use client"

import { useEffect, useState } from "react"

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-extrabold mb-8">
          📊 My History
        </h1>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {loading ? (
            <p className="p-6">Loading...</p>
          ) : history.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">
              No history found
            </p>
          ) : (
            <table className="w-full text-left">
              
              <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
                <tr>
                  <th className="p-4">Match</th>
                  <th className="p-4">Prize</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    
                    <td className="p-4">
                      {item.match_type}
                    </td>

                    <td className="p-4 font-semibold">
                      ₹{item.prize_amount}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>
    </div>
  )
}