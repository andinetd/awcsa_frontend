import { BASE_URL } from "@/lib/base-url";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import axios from "axios";

export const registerNewCareCenter = async (data: NewCareCenterSchemaType) => {
  try {
    const req = await axios.post(
      `${BASE_URL}/adoption/care-center/register`,
      data,
      {
        headers: {
          Authorization: `Bearer ${""}`,
          "Content-Type": "application/json",
        },
      }
    );

    return req.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
