"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ProfileSetupFormProps {
  onComplete: () => void;
}

export default function ProfileSetupForm({
  onComplete,
}: ProfileSetupFormProps) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );

  // Check username availability with debounce (only if username is provided)
  useEffect(() => {
    // Reset availability state if username is empty or too short
    if (!username) {
      setUsernameAvailable(null);
      return;
    }

    // Skip check if username is too short but don't show error yet
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (error && error.code === "PGRST116") {
          // Error code for "no rows returned" -username is available
          setUsernameAvailable(true);
        } else {
          // Username exists
          setUsernameAvailable(false);
        }
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username if provided
    if (username) {
      if (username.length < 3) {
        setError("Username must be at least 3 characters");
        return;
      }

      if (usernameAvailable === false) {
        setError("Username is already taken");
        return;
      }
    }

    // Validate required fields (only first name is required)
    if (!firstName) {
      setError("First anme is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Prepapre profile data object
      const profileData = {
        id: user.id,
        username: username || null,
        first_name: firstName,
        last_name: lastName || null,
        age: age || null,
        birthday: birthday || null,
        updated_at: new Date().toISOString(),
      };

      // Update profile in the database
      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) throw error;

      // Also update user metadata for easy access to common fields
      await supabase.auth.updateUser({
        data: {
          username: username || null,
          first_name: firstName,
          last_name: lastName || null,
        },
      });

      // Call the onComplete callback to redirect the user
      onComplete();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username field (optional) */}
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username (optional)
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Choose a unique username"
            minLength={3}
          />

          {username && username.length < 3 && (
            <p className="text-sm text-gray-500">
              Username must be at least 3 characters
            </p>
          )}

          {username && username.length >= 3 && (
            <div className="text-sm">
              {usernameAvailable === true && (
                <p className="text-green-600">✓ Username available</p>
              )}
              {usernameAvailable === false && (
                <p className="text-red-600">✗ Username already taken</p>
              )}
              {usernameAvailable === null && (
                <p className="text-gray-500">Checking availability...</p>
              )}
            </div>
          )}
        </div>

        {/* First Name (required) */}
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your first name"
            required
          />
        </div>

        {/* Last Name (optional) */}
        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your last name"
          />
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) =>
              setAge(e.target.value ? parseInt(e.target.value) : "")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your age"
            min="1"
            max="120"
          />
        </div>

        {/* Birthday */}
        <div className="space-y-1">
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700"
          >
            Birthday
          </label>
          <input
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={
            loading || (username.length >= 3 && usernameAvailable === false)
          }
        >
          {loading ? "Setting up..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
