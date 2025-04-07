import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className = "", size = "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <Loader2
        className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export { LoadingSpinner };
