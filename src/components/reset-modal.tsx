"use client";

import { useState } from "react";

interface Props {
  onReset: (code: string) => Promise<boolean>;
  onClose: () => void;
}

export function ResetModal({ onReset, onClose }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(false);
    setLoading(true);
    const success = await onReset(code);
    setLoading(false);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold mb-1">Reset All Data</h2>
        <p className="text-sm text-muted mb-4">
          Enter the admin code to reset all schedule data.
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter reset code"
          autoFocus
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
        />
        {error && (
          <p className="text-xs text-danger mt-2">
            Invalid code. Please try again.
          </p>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-sm py-2 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!code || loading}
            className="flex-1 bg-danger hover:bg-danger/80 disabled:opacity-40 text-white text-sm py-2 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}
