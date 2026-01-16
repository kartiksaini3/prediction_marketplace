import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({
  size = "lg",
  fullScreen = false,
  text = "Loading...",
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const content = (
    <div className="flex flex-col items-center gap-4 z-50">
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-white border-opacity-10`}
        ></div>

        {/* Spinning Gradient Ring */}
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-t-transparent border-l-transparent border-r-transparent border-b-primary animate-spin`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-50 blur-md animate-pulse"></div>
        </div>

        {/* Inner Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      </div>

      {text && (
        <p className="text-text-secondary font-medium animate-pulse tracking-wider text-sm uppercase">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0f0c29] bg-opacity-90 backdrop-blur-md flex items-center justify-center z-[9999]">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}
