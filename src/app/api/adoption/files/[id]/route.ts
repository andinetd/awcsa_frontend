import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } =  await params;

  // Forward the Authorization header if present
  const incomingAuth = req.headers.get('authorization') || '';

  const backendUrl = `http://localhost:3000/adoption/files/${id}`;

  try {
    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        ...(incomingAuth ? { Authorization: incomingAuth } : {}),
      },
    });

    // Stream response back to client with same content-type
    const headers: Record<string, string> = {};
    const contentType = res.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    // If backend returned an error status, forward the status and text
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return new Response(text, { status: res.status, headers });
    }

    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, { status: 200, headers });
  } catch (err) {
    console.error('Proxy error fetching file', err);
    return new Response('Proxy error', { status: 502 });
  }
}
