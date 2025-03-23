import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Make sure we're using the correct prigin in production
  let redirectUrl = requestUrl.origin;

  // Safety check: if we're in production but somehow got localhost as origin, override it witht he production URL
  if (
    process.env.Node_ENV === "production" &&
    redirectUrl.includes("localhost")
  ) {
    redirectUrl = "https://memory-keeper-wine.vercel.app";
  }

  // URL to redirect to after sign in process completes- after the authentication flow completes, redirect the user back to the root of the website they came from.
  return NextResponse.redirect(redirectUrl);
}
