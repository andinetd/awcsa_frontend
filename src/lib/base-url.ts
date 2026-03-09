// export const BASE_URL = "http://localhost:3000";
// export const BASE_URL = "https://12948572ff09.ngrok-free.app";
const ip_address = process.env.BASE_URL;

export const BASE_URL = `http://${ip_address}`;
