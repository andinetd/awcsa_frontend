import { NextRequest } from "next/server";
import { BASE_URL } from "@/lib/base-url";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Resolve authentication from incoming header or session cookie
  const cookieToken = req.cookies.get("wcasf_auth_token")?.value;
  const incomingAuth =
    req.headers.get("authorization") ||
    (cookieToken ? `Bearer ${cookieToken}` : "");

  if (!incomingAuth) {
    return new Response(
      JSON.stringify({ message: "Unauthorized: Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const backendUrl = `${BASE_URL}/adoption/files/${id}`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: incomingAuth,
      },
    });

    // Stream response back to client with same content-type
    const headers: Record<string, string> = {};
    const contentType = res.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;

    // If backend returned an error status, forward the status and text
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return new Response(text, { status: res.status, headers });
    }

    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, { status: 200, headers });
  } catch (err) {
    console.error("Proxy error fetching file", err);
    return new Response("Proxy error", { status: 502 });
  }
}
