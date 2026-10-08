const ip_address =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:10000";

export const BASE_URL = ip_address.replace(/\/+$/, "");
