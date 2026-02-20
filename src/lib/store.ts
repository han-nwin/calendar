import { TeamMember } from "./types";

// In-memory store - persists as long as the server is running
let members: TeamMember[] = [];

export function getMembers(): TeamMember[] {
  return members;
}

export function addMember(member: TeamMember): TeamMember {
  // Check if name already exists, update if so
  const existingIndex = members.findIndex(
    (m) => m.name.toLowerCase() === member.name.toLowerCase()
  );
  if (existingIndex !== -1) {
    members[existingIndex] = member;
    return member;
  }
  members.push(member);
  return member;
}

export function deleteMember(id: string): boolean {
  const index = members.findIndex((m) => m.id === id);
  if (index !== -1) {
    members.splice(index, 1);
    return true;
  }
  return false;
}

export function resetStore(): void {
  members = [];
}
