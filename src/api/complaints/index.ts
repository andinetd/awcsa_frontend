import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import {
  Complaint,
  CreateComplaintDto,
  ResolveComplaintDto,
} from "@/types/complaints";
import axios from "axios";

export const submitComplaint = async (data: CreateComplaintDto) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(`${BASE_URL}/complaints`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchMyComplaints = async (): Promise<Complaint[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/complaints/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAllComplaints = async (): Promise<Complaint[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/complaints/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchComplaintById = async (id: string): Promise<Complaint> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/complaints/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const resolveComplaint = async ({
  id,
  data,
}: {
  id: string;
  data: ResolveComplaintDto;
}) => {
  const { token } = useAuthStore.getState();
  const res = await axios.patch(
    `${BASE_URL}/complaints/admin/${id}/resolve`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
