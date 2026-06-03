import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-5xl font-bold text-white mb-4">
          ImageFlow
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Describe any image, find it across the web
        </p>

        <Link
          href="/login"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
        >
          Get Started
        </Link>

      </div>
    </div>
  );
}