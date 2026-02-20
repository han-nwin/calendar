"use client";

import { useState } from "react";
import { TimeWindow, TIME_OPTIONS } from "@/lib/types";

interface DayState {
  enabled: boolean;
  windows: TimeWindow[];
}

interface Props {
  days: string[];
  onSubmit: (
    name: string,
    availability: { day: string; windows: TimeWindow[] }[]
  ) => Promise<void>;
}

export function ScheduleForm({ days, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [dayStates, setDayStates] = useState<Record<string, DayState>>(
    Object.fromEntries(
      days.map((d) => [d, { enabled: false, windows: [{ start: "09:00", end: "17:00" }] }])
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDay = (day: string) => {
    setDayStates((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const addWindow = (day: string) => {
    setDayStates((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        windows: [...prev[day].windows, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeWindow = (day: string, index: number) => {
    setDayStates((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        windows: prev[day].windows.filter((_, i) => i !== index),
      },
    }));
  };

  const updateWindow = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setDayStates((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        windows: prev[day].windows.map((w, i) =>
          i === index ? { ...w, [field]: value } : w
        ),
      },
    }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const availability = Object.entries(dayStates)
      .filter(([, state]) => state.enabled && state.windows.length > 0)
      .map(([day, state]) => ({ day, windows: state.windows }));

    await onSubmit(name.trim(), availability);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setName("");
    setDayStates(
      Object.fromEntries(
        days.map((d) => [d, { enabled: false, windows: [{ start: "09:00", end: "17:00" }] }])
      )
    );
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div className="bg-success/10 border border-success/20 text-success rounded-lg px-4 py-3 text-sm">
          Availability submitted successfully!
        </div>
      )}

      {/* Name Input */}
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm text-muted mb-2">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
        />
        <p className="text-xs text-muted mt-2">
          If you submit again with the same name, it will update your previous entry.
        </p>
      </div>

      {/* Days */}
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm text-muted mb-4">
          Select Available Days & Time Windows
        </label>
        <div className="space-y-3">
          {days.map((day) => {
            const state = dayStates[day];
            return (
              <div
                key={day}
                className={`border rounded-lg transition-all ${
                  state.enabled
                    ? "border-accent/40 bg-accent-light/30"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        state.enabled
                          ? "bg-accent border-accent"
                          : "border-border-hover"
                      }`}
                    >
                      {state.enabled && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        state.enabled ? "text-foreground" : "text-muted"
                      }`}
                    >
                      {day}
                    </span>
                  </button>
                  {state.enabled && (
                    <button
                      type="button"
                      onClick={() => addWindow(day)}
                      className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      + Add Window
                    </button>
                  )}
                </div>

                {state.enabled && (
                  <div className="px-4 pb-3 space-y-2">
                    {state.windows.map((window, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={window.start}
                          onChange={(e) =>
                            updateWindow(day, i, "start", e.target.value)
                          }
                          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="text-muted text-xs">to</span>
                        <select
                          value={window.end}
                          onChange={(e) =>
                            updateWindow(day, i, "end", e.target.value)
                          }
                          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {state.windows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWindow(day, i)}
                            className="text-muted hover:text-danger text-xs transition-colors cursor-pointer ml-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!name.trim() || submitting}
        className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit Availability"}
      </button>
    </div>
  );
}
