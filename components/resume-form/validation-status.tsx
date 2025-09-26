import React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useFormValidationState } from "@/lib/validation/hooks";

interface ValidationStatusProps {
  formType: 'profile' | 'workExperience' | 'education' | 'project' | 'skills' | 'custom';
  idx?: number;
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ 
  formType, 
  idx, 
  className = "" 
}) => {
  const { isValid, errors } = useFormValidationState(formType, idx);

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
        {errors.length} error{errors.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export const ValidationSummary: React.FC<{ 
  formType: 'profile' | 'workExperience' | 'education' | 'project' | 'skills' | 'custom';
  idx?: number;
}> = ({ formType, idx }) => {
  const { isValid, errors } = useFormValidationState(formType, idx);

  if (isValid) return null;

  return (
    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start space-x-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-red-800">
            Please fix the following errors:
          </h4>
          <ul className="mt-1 text-sm text-red-700 list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                <span className="font-medium">{error.field}:</span> {error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
