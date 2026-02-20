import { NextResponse } from "next/server";
import { getMembers, addMember } from "@/lib/store";
import { TeamMember } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getMembers());
}

export async function POST(request: Request) {
  const body = await request.json();
  const member: TeamMember = {
    id: crypto.randomUUID(),
    name: body.name,
    availability: body.availability,
    createdAt: new Date().toISOString(),
  };
  const saved = addMember(member);
  return NextResponse.json(saved, { status: 201 });
}
