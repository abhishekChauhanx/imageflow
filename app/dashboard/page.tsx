"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { data: session } = useSession();

    useEffect(() => {
        // Show welcome toast only once on first load
        const hasShown = sessionStorage.getItem("welcomeShown");
        if (!hasShown && session?.user) {
            toast.success(
                `Welcome back, ${session.user.name?.split(" ")[0] || "there"}! 👋`,
                { duration: 4000 }
            );
            sessionStorage.setItem("welcomeShown", "true");
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* Navbar */}
            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">🔍 ImageFlow</h1>
                <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">
                        {session?.user?.email}
                    </span>
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {session?.user?.name?.charAt(0).toUpperCase() ||
                                session?.user?.email?.charAt(0).toUpperCase() ||
                                "?"}
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Find Any Image
                </h2>
                <p className="text-zinc-400 mb-10">
                    Describe the image you are looking for and we will find it across the web
                </p>

                {/* Search Box (placeholder for now) */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="a snowy mountain at golden hour..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition">
                        Search
                    </button>
                </div>
            </main>

        </div>
    );
}