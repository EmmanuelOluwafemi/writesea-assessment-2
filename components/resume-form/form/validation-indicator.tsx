import React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ValidationIndicatorProps {
  isValid: boolean;
  errorCount?: number;
  className?: string;
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ 
  isValid, 
  errorCount = 0, 
  className = "" 
}) => {
  if (isValid) {
    return (
      <div className={`flex items-center space-x-1 text-green-600 ${className}`}>
        <CheckCircleIcon className="h-4 w-4" />
        <span className="text-xs font-medium">Valid</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 text-red-600 ${className}`}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <span className="text-xs font-medium">
        {errorCount} error{errorCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export const ValidationMessage: React.FC<{ 
  error?: string;
  isValid: boolean;
}> = ({ error, isValid }) => {
  if (isValid || !error) return null;

  return (
    <div className="mt-1 flex items-start space-x-1">
      <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
};
