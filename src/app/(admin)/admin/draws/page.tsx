"use client"

import { useState } from "react"

export default function DrawPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const runDraw = async () => {
    try {
      setLoading(true)
      setMessage("")

      const res = await fetch("/api/draw", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage("❌ Failed to run draw")
        return
      }

      console.log(data)
      setMessage("✅ Draw completed successfully!")
    } catch (err) {
      setMessage("⚠️ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-blue-200/40 hover:shadow-2xl transition-all duration-300 flex flex-col gap-6">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          🎯 Admin Panel
        </h1>

        <p className="text-center text-gray-500">
          Run monthly lucky draw for all participants
        </p>

        {/* Status Message */}
        {message && (
          <p className="text-center text-sm font-medium">
            {message}
          </p>
        )}

        {/* Button */}
        <button
          onClick={runDraw}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 transition text-white p-4 rounded-xl font-semibold shadow-md"
        >
          {loading ? "Running Draw..." : "Run Monthly Draw"}
        </button>

        {/* Info Box */}
        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
          ⚠️ This action will randomly select winners and distribute rewards.
        </div>
      </div>
    </div>
  )
}