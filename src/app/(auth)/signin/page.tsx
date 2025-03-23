// Auth compoentnent config inc redirect
// app/(auth)/signin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import styles from "./SignIn.module.css";
import { useRouter } from "next/navigation";

export default function AuthSignInPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      // Redirect to dashboard if already logged in
      if (session) {
        router.push("/");
      }
    };

    // Called immediately to check if they were already logged in when user first opens the page
    checkSession();

    // Set up auth state change listener to watch for any future login changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Redirect to dashboard when user logs in
      if (session) {
        router.push("/");
      }
    });

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, [router]);

  // define the reditect URL based on environment
  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <div className={styles.header}>
            {/* <h1 className={styles.title}>Welcome Back</h1> */}
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              className: {
                container: "auth-container",
                button: "auth-button",
                input: "auth-input",
                label: "auth-label",
                anchor: "auth-link",
              },
              style: {
                button: {
                  borderRadius: "0.5rem",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  fontWeight: "500",
                  padding: "0.625rem 1.25rem",
                },
                input: {
                  borderRadius: "0.5rem",
                  padding: "0.625rem 1rem",
                  border: "1px solid #E5E7EB",
                  fontSize: "0.875rem",
                },
                anchor: {
                  color: "#4F46E5",
                  fontWeight: "500",
                },
              },
            }}
            // remove forgotten pasword links/section for now
            localization={{
              variables: {
                // @ts-expect-error -- We know this works even though TypeScript doesn't
                forgotten_password: "", // Try direct property
              },
            }}
            // Add your preferred providers
            providers={["google", "github"]}
            redirectTo={redirectUrl}
          />

          {/* <div className={styles.footer}>
            <p>
              Need help?{" "}
              <a href="#" className={styles.link}>
                Contact support
              </a>
            </p>
          </div> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back!</h1>
            <p className={styles.subtitle}>
              You are logged in as: {session.user.email}
            </p>
          </div>

          <button
            className={styles.logoutButton}
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
}
