import SubscribeButton from "@/components/SubscribeButton"

export default function PricingPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">Choose Your Plan</h1>

      <div className="flex gap-6">
        <div className="border p-6">
          <h2>Monthly</h2>
          <p>₹500/month</p>
          <SubscribeButton />
        </div>

        <div className="border p-6">
          <h2>Yearly</h2>
          <p>₹5000/year</p>
          <SubscribeButton />
        </div>
      </div>
    </div>
  )
}