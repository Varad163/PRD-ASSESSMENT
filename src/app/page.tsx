
import SubscribeButton from "@/components/SubscribeButton"

export default function Home() {
  return (
    
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">

      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl font-bold mb-6">
        Play Golf.
        <br />
        <span className="text-blue-600">Win Rewards.</span>
        <br />
        Give Back ❤️
      </h1>
      <div className="bg-red-500 text-white p-10 text-3xl">
  TAILWIND TEST
</div>

      {/* Subtext */}
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Track your scores, participate in monthly draws,
        and contribute to meaningful charities.
      </p>

      {/* CTA */}
 <div className="flex gap-4 mt-6">

  <a
    href="/register"
    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
  >
    Get Started
  </a>

  <a
    href="/login"
    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100"
  >
    Login
  </a>

</div>
      {/* Stats */}
      <div className="flex gap-10 mt-12 text-center">
        <div>
          <p className="text-2xl font-bold">12K+</p>
          <p className="text-gray-500 text-sm">Golfers</p>
        </div>
        <div>
          <p className="text-2xl font-bold">$480K</p>
          <p className="text-gray-500 text-sm">Donated</p>
        </div>
        <div>
          <p className="text-2xl font-bold">340+</p>
          <p className="text-gray-500 text-sm">Charities</p>
        </div>
      </div>

    </main>
  )
}