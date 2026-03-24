import SubscribeButton from "@/components/SubscribeButton"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">
        Play Golf. Win Rewards. Give Back.
      </h1>

      <p className="text-gray-400">
        Track your scores, enter monthly draws, and support charities.
      </p>

      <SubscribeButton />
    </main>
  )
}