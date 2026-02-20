"use client";

import { TeamMember, DAYS_OF_WEEK } from "@/lib/types";
import { useState } from "react";

interface Props {
  members: TeamMember[];
  onDelete: (id: string) => Promise<void>;
}

export function ScheduleView({ members, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");

  if (members.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted text-sm">
          No team members have submitted their availability yet.
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  // Build overlap data
  const overlapData = DAYS_OF_WEEK.map((day) => {
    const dayMembers = members.filter((m) =>
      m.availability.some((a) => a.day === day)
    );
    return { day, count: dayMembers.length, members: dayMembers };
  });

  return (
    <div className="space-y-6">
      {/* Overview Grid */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-medium text-muted mb-4">
          Weekly Overview
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {overlapData.map(({ day, count }) => (
            <div
              key={day}
              className="text-center p-3 rounded-lg border border-border"
            >
              <div className="text-xs text-muted mb-1">{day.slice(0, 3)}</div>
              <div
                className={`text-lg font-semibold ${
                  count > 0 ? "text-foreground" : "text-muted/30"
                }`}
              >
                {count}
              </div>
              <div className="text-[10px] text-muted">
                {count === 1 ? "person" : "people"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Cards */}
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{member.name}</h3>
                  <p className="text-[11px] text-muted">
                    {member.availability.length} day
                    {member.availability.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
              {confirmingId === member.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && confirmName === member.name) {
                        handleDelete(member.id);
                        setConfirmingId(null);
                        setConfirmName("");
                      } else if (e.key === "Escape") {
                        setConfirmingId(null);
                        setConfirmName("");
                      }
                    }}
                    placeholder={`Type "${member.name}"`}
                    autoFocus
                    className="w-32 bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-danger transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (confirmName === member.name) {
                        handleDelete(member.id);
                        setConfirmingId(null);
                        setConfirmName("");
                      }
                    }}
                    disabled={confirmName !== member.name || deletingId === member.id}
                    className="text-xs text-danger disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deletingId === member.id ? "..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmingId(null);
                      setConfirmName("");
                    }}
                    className="text-xs text-muted hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setConfirmingId(member.id);
                    setConfirmName("");
                  }}
                  className="text-xs text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {member.availability.map((avail) => (
                <div
                  key={avail.day}
                  className="bg-background rounded-lg px-3 py-2 border border-border"
                >
                  <div className="text-xs font-medium text-foreground mb-1">
                    {avail.day.slice(0, 3)}
                  </div>
                  {avail.windows.map((w, i) => (
                    <div key={i} className="text-[11px] text-muted">
                      {w.start} - {w.end}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
