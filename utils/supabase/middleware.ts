import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // ──────────────────────────────────────────────────────────
    // Handle PKCE OAuth code exchange at ANY URL
    // Supabase may redirect the ?code= param to the root or
    // to /auth/callback depending on config. Handle both.
    // ──────────────────────────────────────────────────────────
    const code = request.nextUrl.searchParams.get('code');
    const pathname = request.nextUrl.pathname;

    if (code && pathname !== '/auth/callback') {
        // Exchange the auth code for a session right here in the middleware
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Determine the correct origin for redirect
            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            let redirectBase: string;
            if (isLocalEnv) {
                redirectBase = request.nextUrl.origin;
            } else if (forwardedHost) {
                redirectBase = `https://${forwardedHost}`;
            } else {
                redirectBase = request.nextUrl.origin;
            }

            const redirectUrl = new URL('/dashboard', redirectBase);
            const redirectResponse = NextResponse.redirect(redirectUrl);

            // CRITICAL: Copy session cookies from supabaseResponse to the redirect
            // Without this, the auth session is lost and the user won't be logged in
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
            });

            return redirectResponse;
        }
    }

    // Refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect Dashboard Routes
    if (pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Redirect logged-in users away from /auth page
    // Exclude /auth/callback and /auth/reset — those must always be reachable
    if (pathname === '/auth' && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
}
