import React from "react";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface FormValidationSummaryProps {
  errors: Array<{ field: string; message: string }>;
  isValid: boolean;
  className?: string;
}

export const FormValidationSummary: React.FC<FormValidationSummaryProps> = ({ 
  errors, 
  isValid, 
  className = "" 
}) => {
  if (isValid) {
    return (
      <div className={`flex items-center space-x-2 text-green-600 text-sm ${className}`}>
        <CheckCircleIcon className="h-4 w-4" />
        <span>All fields are valid</span>
      </div>
    );
  }

  if (errors.length === 0) return null;

  return (
    <div className={`mt-3 p-3 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <div className="flex items-start space-x-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">
            {errors.length} validation error{errors.length !== 1 ? 's' : ''}:
          </h4>
          <ul className="mt-2 text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="text-red-500">•</span>
                <span>
                  <span className="font-medium capitalize">{error.field.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
