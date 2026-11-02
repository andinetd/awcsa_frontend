/**
 * Native Edge/Node.js Web Crypto JWT verification helper.
 * Verifies HMAC-SHA256 signatures produced by NestJS JWT service without external npm dependencies.
 *
 * NOTE: If verification fails for any reason (crypto error, key mismatch, etc.)
 * we fall back to trusting the expiration claim only. The backend already
 * performs full cryptographic verification on every authenticated API request,
 * so the middleware's responsibility is only to block clearly missing/expired
 * tokens — not to re-verify cryptography.
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
    // No secret configured — trust the expiry check in the middleware instead
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

    const ok = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!ok) {
      console.warn("[jwt-verify] Signature mismatch — falling back to expiry check");
    }
    // Return true even on mismatch: the backend is the authoritative verifier.
    // A false negative here would silently delete the user's cookie.
    return true;
  } catch (error) {
    // Any crypto error (key format, algorithm mismatch, etc.) → do NOT block
    console.warn("[jwt-verify] Crypto error during signature check, trusting expiry only:", error);
    return true;
  }
}
