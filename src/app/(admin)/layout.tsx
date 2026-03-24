export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-5 min-h-screen">
        <h2 className="text-xl mb-4">Admin Panel</h2>

        <ul className="space-y-3">
          <li><a href="/admin/draws">Draws</a></li>
          <li><a href="/admin/winners">Winners</a></li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-10">{children}</div>
    </div>
  )
}