import { NextResponse } from 'next/server';

// This function handles GET requests to /api/config
export async function GET() {
  try {
    const config = {
      authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID, // This will be specific to the 'auth' app
      redirectUri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI,
      postLogoutRedirectUri: process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
      silentRedirectUri: process.env.NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI,
      scope: process.env.NEXT_PUBLIC_OIDC_SCOPE || 'openid profile email offline_access',
    };

    // Server-side validation to ensure config is complete
    for (const [key, value] of Object.entries(config)) {
      if (!value) {
        // Log an error on the server if a variable is missing
        console.error(`[API Config] Missing runtime environment variable on server: ${key}`);
        // Return an error response to the client
        return new NextResponse(`Configuration error: Missing '${key}'`, { status: 500 });
      }
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('[API Config] Failed to serve configuration', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
