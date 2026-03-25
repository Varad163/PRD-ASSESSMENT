"use client"

import { useEffect, useState } from "react"

export default function SubscriptionsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then((res) => res.json())
      .then((data) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          💳 Subscriptions
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
                  <th className="p-4">Plan</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {data.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {sub.users?.email}
                    </td>

                    <td className="p-4 text-gray-600">
                      {sub.plan}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {sub.status}
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