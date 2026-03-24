"use client"

import { useSession } from "next-auth/react"

export default function AdminPage() {
  const { data: session } = useSession()

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Admin Panel 👑</h1>
      <p>Welcome {session?.user?.email}</p>
    </div>
  )
}