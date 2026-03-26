"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function AdminPage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-950 text-white p-6 flex flex-col justify-between shadow-xl">
        
        <div>
          {/* Logo */}
          <h2 className="text-2xl font-extrabold mb-8 tracking-tight">
            ⚡ Admin
          </h2>

          {/* Navigation */}
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/draws"
                className="block px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                🎯 Draws
              </Link>
            </li>

            <li>
              <Link
                href="/admin/winners"
                className="block px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                🏆 Winners
              </Link>
            </li>

            <li>
              <Link
                href="/admin/subscriptions"
                className="block px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                💳 Subscriptions
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3">
          
          {/* User Info */}
          <div className="bg-gray-800 p-3 rounded-lg text-sm">
            👤 {session?.user?.email}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-50">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold">1,240</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">₹45,000</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Active Draws</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <button
  onClick={async () => {
    const res = await fetch("/api/admin/calculate", {
      method: "POST",
    })
    const data = await res.json()
    const runDraw = async () => {
  const res = await fetch("/api/admin/calculate", {
    method: "POST",
  })

  const data = await res.json()

  console.log("CALC:", data)

  if (!res.ok) {
    alert("Error: " + data.error)
    return
  }

  alert(`Winners: ${data.winners}`)
}

  }}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Run Draw Calculation
</button>

        </div>
      </div>
    </div>
  )
}