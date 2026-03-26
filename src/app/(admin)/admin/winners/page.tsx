"use client"

import { useEffect, useState } from "react"

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWinners = async () => {
    try {
      const res = await fetch("/api/admin/winners")

      if (!res.ok) {
        setWinners([])
        return
      }

      const data = await res.json()

      setWinners(data || []) // ✅ FIXED
    } catch (err) {
      console.error(err)
      setWinners([])
    } finally {
      setLoading(false)
    }
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

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          🏆 Winners
        </h1>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Matches</th>
                  <th className="p-4">Prize</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {winners.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">

                    {/* Email */}
                    <td className="p-4 font-medium text-gray-800">
                      {w.users?.email || "N/A"}
                    </td>

                    {/* Tier */}
                    <td className="p-4">
                      {w.tier}
                    </td>

                    {/* Matches */}
                    <td className="p-4">
                      {w.match_count}
                    </td>

                    {/* Prize */}
                    <td className="p-4 font-semibold text-gray-900">
                      ₹{w.prize}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          w.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {w.status || "pending"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      {w.status !== "paid" && (
                        <button
                          onClick={() => markPaid(w.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
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