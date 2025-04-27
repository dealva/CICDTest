import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw { status: 401, message: "Not authenticated" };
  return session;
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status });
}

export function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ message }), { status });
}
