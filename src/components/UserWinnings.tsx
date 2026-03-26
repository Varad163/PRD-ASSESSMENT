"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSession } from "next-auth/react"

type Winner = {
  id: string
  user_id: string
  prize_amount: number
  status: string
  proof_url: string | null
}

export default function UserWinnings() {
  const { data: session } = useSession()
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch winners using user_id (FIXED)
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchWinners = async () => {
      const { data, error } = await supabase
        .from("winners")
        .select("*")
        .eq("user_id", session.user.id) // ✅ FIX HERE

      if (error) {
        console.error("Supabase error:", error)
      } else {
        setWinners(data || [])
      }

      setLoading(false)
    }

    fetchWinners()
  }, [session])

  // ✅ Upload proof
  const uploadProof = async (file: File, id: string) => {
  const filePath = `proofs/${id}-${Date.now()}`

  const { error: uploadError } = await supabase.storage
    .from("proofs")
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error("UPLOAD ERROR:", uploadError)
    alert("Upload failed: " + uploadError.message)
    return
  }

  const { data } = supabase.storage
    .from("proofs")
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from("winners")
    .update({ proof_url: data.publicUrl })
    .eq("id", id)

  if (updateError) {
    console.error(updateError)
    alert("DB update failed")
    return
  }

  alert("Proof uploaded successfully!")
  location.reload()
}

  if (loading) {
    return <p className="mt-6">Loading winnings...</p>
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="font-semibold mb-4">💰 My Winnings</h3>

      {/* ❌ No winnings */}
      {winners.length === 0 && (
        <p className="text-gray-500">No winnings yet</p>
      )}

      {/* ✅ List */}
      {winners.map((w) => (
        <div
          key={w.id}
          className="border p-4 rounded mb-3 flex justify-between items-center"
        >
          {/* LEFT */}
          <div>
            <p className="font-semibold">
              Prize: ₹{w.prize_amount}
            </p>

            <p>
              Status:{" "}
              <span
                className={
                  w.status === "paid"
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {w.status}
              </span>
            </p>

            {/* Proof link */}
            {w.proof_url && (
              <a
                href={w.proof_url}
                target="_blank"
                className="text-blue-500 text-sm underline"
              >
                View Proof
              </a>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* Upload proof */}
            {!w.proof_url && w.status === "pending" && (
              <input
                type="file"
                className="text-sm"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadProof(e.target.files[0], w.id)
                  }
                }}
              />
            )}

            {/* Paid badge */}
            {w.status === "paid" && (
              <span className="text-green-600 font-bold">
                Paid ✅
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}