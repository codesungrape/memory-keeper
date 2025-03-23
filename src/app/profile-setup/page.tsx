"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProfileSetupForm from "@/components/ProfileSetup/ProfileSetupForm"; // We'll create this component next

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to sign in if no session
        router.push("/signin");
        return;
      }

      // Check if user already has a completed profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", session.user.id)
        .single();

      // If user already has a first name (profile is complete), redirect to homepage
      if (profile?.first_name && profile.first_name !== "New User") {
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

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
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Profile
      </h1>
      <ProfileSetupForm onComplete={() => router.push("/")} />
    </div>
  );
}
