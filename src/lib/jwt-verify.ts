/**
 * Native Edge/Node.js Web Crypto JWT verification helper.
 * Verifies HMAC-SHA256 signatures produced by NestJS JWT service without external npm dependencies.
 */

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifyJwtSignature(
  token: string,
  secret?: string,
): Promise<boolean> {
  const jwtSecret = secret || process.env.JWT_SECRET;
  if (!jwtSecret) {
    // If no secret is configured in the environment, fallback to payload expiration checks
    return true;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    return await crypto.subtle.verify("HMAC", key, signature, data);
  } catch (error) {
    console.error("JWT signature verification error:", error);
    return false;
  }
}
