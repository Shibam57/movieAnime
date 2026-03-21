import React from "react";
import clsx from "clsx";

// Outer Card wrapper
export function Card({ className, children }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-sm border border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}

// Header section (optional)
export function CardHeader({ className, children }) {
  return (
    <div
      className={clsx(
        "px-6 py-4 border-b border-gray-100 text-lg font-semibold flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

// Content section
export function CardContent({ className, children }) {
  return (
    <div className={clsx("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={clsx(
        "p-4 border-t border-gray-200 text-sm text-gray-500",
        className)}>
      {children}
    </div>
  );
}