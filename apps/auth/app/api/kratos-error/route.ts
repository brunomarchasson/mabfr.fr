import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = await request.nextUrl.searchParams;
  const errorId = searchParams.get('id');

  if (!errorId) {
    return new Response(JSON.stringify({ error: "No error ID provided" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // This request happens server-side. It calls the Kratos admin API via the Caddy proxy.
    const kratosAdminUrl = 'http://localhost/kratos-admin/admin';
    const res = await fetch(`${kratosAdminUrl}/self-service/errors?id=${errorId}`);
    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: "Failed to fetch from Kratos API", status: res.status, message: text }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: "Internal server error", details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
