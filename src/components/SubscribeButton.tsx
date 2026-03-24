"use client"

export default function SubscribeButton() {
  const handleSubscribe = async (plan: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleSubscribe("monthly")}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Monthly
      </button>

      <button
        onClick={() => handleSubscribe("yearly")}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Yearly
      </button>
    </div>
  )
}