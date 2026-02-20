"use client";

import { useState, useEffect, useCallback } from "react";
import { TeamMember, DAYS_OF_WEEK, TimeWindow } from "@/lib/types";
import { ScheduleForm } from "@/components/schedule-form";
import { ScheduleView } from "@/components/schedule-view";
import { ResetModal } from "@/components/reset-modal";

export default function Home() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"submit" | "view">("submit");

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSubmit = async (
    name: string,
    availability: { day: string; windows: TimeWindow[] }[]
  ) => {
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, availability }),
    });
    await fetchMembers();
    setActiveTab("view");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    await fetchMembers();
  };

  const handleReset = async (code: string): Promise<boolean> => {
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      await fetchMembers();
      setShowResetModal(false);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Team Schedule
            </h1>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs text-muted hover:text-danger transition-colors cursor-pointer"
          >
            Reset Data
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-card rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
              activeTab === "submit"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Submit Availability
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
              activeTab === "view"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            View Schedule
            {members.length > 0 && (
              <span className="ml-2 bg-foreground text-background text-xs px-1.5 py-0.5 rounded-full">
                {members.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === "submit" ? (
          <ScheduleForm days={[...DAYS_OF_WEEK]} onSubmit={handleSubmit} />
        ) : (
          <ScheduleView members={members} onDelete={handleDelete} />
        )}
      </main>

      {/* Reset Modal */}
      {showResetModal && (
        <ResetModal
          onReset={handleReset}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
