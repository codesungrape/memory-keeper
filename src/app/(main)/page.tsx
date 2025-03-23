"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to sign in if no session
        router.push("/signin");
        return;
      }

      // Check if user has completed their profile setup
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, username, last_name")
        .eq("id", session.user.id)
        .single();

      // If first_name is missing or still the default value, redirect to profile setup
      if (!profile?.first_name || profile.first_name === "New User") {
        router.push("/profile-setup");
        return;
      }

      // User is authenticated and has a complete profile
      setUser({
        ...session.user,
        profile,
      });
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error.message);
      } else {
        // Redirect to sign-in page after successful logout
        router.push("/signin");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome to Your Memory Dashboard
          </h1>
          <p className="text-gray-600">
            Hello, {user.profile.first_name} {user.profile.last_name || ""}
            {user.profile.username ? ` (@${user.profile.username})` : ""}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <p>View and manage your memories here</p>
      {/* Dashboard content for authenticated users */}
      <div className="dashboard-summary mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Memories</h2>
        {/* Content for authenticated users */}
        <p className="text-gray-500">Your memories will appear here...</p>
      </div>
    </div>
  );
}
