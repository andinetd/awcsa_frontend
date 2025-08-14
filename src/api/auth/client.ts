import { BASE_URL } from "@/lib/base-url";
import axios from "axios";

export const clientSignup = async (data: ClientSignup) => {
  try {
    const sendReq = await axios.post(
      `${BASE_URL}/auth/clients/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const reqRes = await sendReq.data;
    return reqRes;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const clientSignIn = async (data: ClientSignIn) => {
  try {
    const sendReq = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const reqRes = await sendReq.data;
    return reqRes;
  } catch (error) {
    throw new Error(error as any);
  }
};
