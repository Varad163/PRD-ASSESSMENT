"use client"

export default function DrawPage() {
  const runDraw = async () => {
    const res = await fetch("/api/draw", {
      method: "POST",
    })

    const data = await res.json()
    console.log(data)
    alert("Draw completed!")
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Run Draw</h1>

      <button onClick={runDraw} className="bg-red-500 p-3">
        Run Monthly Draw
      </button>
    </div>
  )
}