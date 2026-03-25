"use client"

import { useEffect, useState } from "react"

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWinners = async () => {
    const res = await fetch("/api/admin/winners")
    const data = await res.json()
    setWinners(data.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const markPaid = async (id: string) => {
    await fetch("/api/admin/winners/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })

    fetchWinners()
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          🏆 Winners
        </h1>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-left">
              
              {/* Header */}
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Match</th>
                  <th className="p-4">Prize</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {winners.map((w) => (
                  <tr
                    key={w.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Email */}
                    <td className="p-4 font-medium text-gray-800">
                      {w.users?.email}
                    </td>

                    {/* Match */}
                    <td className="p-4 text-gray-600">
                      {w.match_type}
                    </td>

                    {/* Prize */}
                    <td className="p-4 font-semibold text-gray-900">
                      ₹{w.prize_amount}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          w.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      {w.status !== "paid" && (
                        <button
                          onClick={() => markPaid(w.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          Mark Paid
                        </button>
                      )}
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