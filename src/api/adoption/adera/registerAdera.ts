import { BASE_URL } from "@/lib/base-url";
import { NewAderaSchemaType } from "@/schemas/adera-schema";
import axios from "axios";

export const registerAdera = async (data: NewAderaSchemaType) => {
  try {
    const req = await axios.post(`${BASE_URL}/adoption/adera/register`, data, {
      headers: {
        Authorization: `Bearer ${""}`,
        "Content-Type": "application/json",
      },
    });

    return req.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
