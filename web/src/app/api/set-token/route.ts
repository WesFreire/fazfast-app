import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { access, refresh } = await req.json();

  const cookieStore = await cookies();

  cookieStore.set("access", access, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("refresh", refresh, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ message: "tokens saved" });
}
