"use client"

import { useEffect, useState } from "react"

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])

  const fetchWinners = async () => {
    const res = await fetch("/api/admin/winners")
    const data = await res.json()
    setWinners(data.data || [])
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const markPaid = async (id: string) => {
    await fetch("/api/admin/winners/pay", {
      method: "POST",
      body: JSON.stringify({ id }),
    })

    fetchWinners()
  }

  return (
    <div>
      <h1 className="text-2xl mb-6">Winners</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Match</th>
            <th>Prize</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {winners.map((w) => (
            <tr key={w.id} className="border">
              <td>{w.users?.email}</td>
              <td>{w.match_type}</td>
              <td>₹{w.prize_amount}</td>
              <td>{w.status}</td>
              <td>
                {w.status !== "paid" && (
                  <button
                    onClick={() => markPaid(w.id)}
                    className="bg-green-500 px-2 py-1"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}