"use client"

import { useEffect, useState } from "react"

export default function SubscriptionsPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Subscriptions</h1>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((sub) => (
            <tr key={sub.id} className="border text-center">
              <td>{sub.users?.email}</td>
              <td>{sub.plan}</td>
              <td>{sub.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}