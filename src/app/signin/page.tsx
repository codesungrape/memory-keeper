"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import styles from "./SignIn.module.css";

export default function AuthSignInPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back</h1>
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
            // Add your preferred providers
            providers={["google", "github"]}
            redirectTo={
              typeof window !== "undefined" ? window.location.origin : undefined
            }
          />

          <div className={styles.footer}>
            <p>
              Need help?{" "}
              <a href="#" className={styles.link}>
                Contact support
              </a>
            </p>
          </div>
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
