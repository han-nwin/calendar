import { NextResponse } from "next/server";
import { resetStore } from "@/lib/store";

const RESET_CODE = "hannwin";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.code !== RESET_CODE) {
    return NextResponse.json({ error: "Invalid reset code" }, { status: 403 });
  }
  resetStore();
  return NextResponse.json({ success: true });
}
