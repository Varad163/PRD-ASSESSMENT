"use client"

import { useEffect, useState } from "react"

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWinners = async () => {
    try {
      const res = await fetch("/api/admin/winners")
      const data = await res.json()

      console.log("WINNERS:", data)

      setWinners(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  // ✅ Mark as paid
  const markAsPaid = async (id: string) => {
    try {
      const res = await fetch("/api/admin/mark-paid", {
        method: "POST",
        body: JSON.stringify({ id }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to update")
        return
      }

      alert("Marked as paid")
      fetchWinners()
    } catch (err) {
      console.error(err)
      alert("Error updating status")
    }
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
          ) : winners.length === 0 ? (
            <p className="p-6 text-gray-500">No winners yet</p>
          ) : (
            <table className="w-full text-left">

              {/* Header */}
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Matches</th>
                  <th className="p-4">Prize</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Proof</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {winners.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">

                    {/* Email */}
                    <td className="p-4 font-medium text-gray-800">
                      {w.users?.email || "No Email"}
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
                    <td className="p-4 font-semibold">
                      ₹{w.prize_amount}
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
                        {w.status}
                      </span>
                    </td>

                    {/* Proof */}
                    <td className="p-4">
                      {w.proof_url ? (
                        <a
                          href={w.proof_url}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">No Proof</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      {w.status === "pending" && w.proof_url && (
                        <button
                          onClick={() => markAsPaid(w.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mark Paid
                        </button>
                      )}

                      {w.status === "paid" && (
                        <span className="text-green-600 font-semibold">
                          Paid
                        </span>
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