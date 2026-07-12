import React from "react";

export default function FormModal({
  title,
  isOpen,
  onClose,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-panel rounded-xl border border-border shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-muted hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}