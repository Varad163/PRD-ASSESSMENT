import SubscribeButton from "@/components/SubscribeButton"

export default function Dashboard() {
  const isSubscribed = false // later from DB

  if (!isSubscribed) {
    return (
      <div className="p-10">
        <h2>You are not subscribed</h2>
        <SubscribeButton />
      </div>
    )
  }

  return <div>Dashboard Content</div>
}