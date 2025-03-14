## issues 7-19

### Debugging why redirect doesnt work, goes to localhosy:3000 when in production.

- [x] 1. Check if the redirect is working in development.
- [x] 2. Check if the redirect is working in production.
- after isolations, the redirect works in development but not in production.
- chhecked the redirect in production, originally it was using

```javascript
redirectTo={
              typeof window !== "undefined"
                ? process.env.NEXT_PUBLIC_REDIRECT_URL || window.location.origin
                : undefined
            }
```

- changed it to

```javascript
redirectTo={
              typeof window !== "undefined"
                ? process.env.NODE_ENV === "production"
                  ? "https://memory-keeper-wine.vercel.app/auth/callback"
                  : "http://localhost:3000/auth/callback"
                : undefined
            }
```

- The reason for this is because the redirect url is not being set in production, so it defaults to the window.location.origin which is localhost:3000. This is why the redirect is not working in production.
- I hardcoded the redirect url to the production url as I read 'original redirect failed in production because

```javascript
window.location.origin;
```

dynamically determines the URL based on the current browser window, which causes issues with server-side rendering, potential domain mismatches, OAuth providers requiring pre-registered exact URLs, and possible inconsistencies with backend configurations'. This NEEDS TO VE VERIFIED

- It also turned out I had not added the redirect url into Supabase, so I added the redirect url to the Supabase settings. If the above point turns out to be false an works even with 'window.location.origin' - THIS was the main reason the redirect was not working in production.

- The fix used, not 'window.location.origin' but the hardcoded redirect url, is apprantely more superior according to claude.ai becaseu:
  - It uses hardcoded, specific URLs for each environment rather than dynamic values
  - OAuth providers like Supabase require exact, pre-registered redirect URLs
  - It avoids the inconsistency issues that can occur with window.location.origin
  - It eliminates problems with server-side rendering and domain mismatches
  - You can register these exact URLs in your Supabase dashboard, ensuring they'll always match
