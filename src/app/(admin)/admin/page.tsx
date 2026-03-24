"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function AdminPage() {
  const { data: session } = useSession()

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 min-h-screen">
        <h2 className="text-xl mb-4">Admin Panel</h2>

        <ul className="space-y-3">
          <li>
            <Link href="/admin/draws">Draws</Link>
          </li>
          <li>
            <Link href="/admin/winners">Winners</Link>
          </li>
          <li>
            <Link href="/admin/subscriptions">Subscriptions</Link>
          </li>
        </ul>

        <p className="mt-6 text-sm">
          Welcome {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
    </div>
  )
}