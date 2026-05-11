import { cookies } from "next/headers";
import { cache } from "react";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const getAuthUser = cache(async (token: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-db": process.env.NEXT_PUBLIC_TENANT_ID || "",
      } as HeadersInit,
    });
    const data = await res.json();
    return serialize(data);
  } catch (error) {
    console.error("Error fetching auth user:", error);
    return null;
  }
});
