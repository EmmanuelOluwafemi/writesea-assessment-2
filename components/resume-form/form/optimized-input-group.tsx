import React, { useCallback, useMemo, useState, useRef } from "react";
import { useAutosizeTextareaHeight } from "@/lib/hooks/use-autosize-textarea-height";
import { z } from "zod";

interface OptimizedInputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
  validationSchema?: z.ZodSchema<V>;
  showValidation?: boolean;
  validateOnBlur?: boolean; // Only validate when user leaves the field
}

/**
 * Optimized InputGroupWrapper that minimizes re-renders
 */
const OptimizedInputGroupWrapper = React.memo(({
  label,
  className,
  children,
  error,
  showError = true,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
  error?: string;
  showError?: boolean;
}) => (
  <div className={`w-full ${className}`}>
    <label className="text-base font-medium text-gray-700">
      {label}
      {children}
    </label>
    {showError && error && (
      <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
    )}
  </div>
));

const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border text-gray-900 shadow-sm outline-none font-normal text-base transition-colors duration-200";

const getInputClassName = (hasError: boolean) =>
  `${INPUT_CLASS_NAME} ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  }`;

/**
 * Performance-optimized input that only validates on blur
 */
export const OptimizedInput = React.memo(<K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
  validationSchema,
  showValidation = true,
  validateOnBlur = true,
}: OptimizedInputProps<K, string>) => {
  const [error, setError] = useState<string | undefined>();
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  
  const validateField = useCallback((valueToValidate: string) => {
    if (!validationSchema || !showValidation) {
      setError(undefined);
      return;
    }
    
    try {
      validationSchema.parse(valueToValidate);
      setError(undefined);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message);
      } else {
        setError("Validation error");
      }
    }
  }, [validationSchema, showValidation]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(name, newValue);
      
      // Only validate if the field has been blurred before (user has interacted with it)
      if (hasBeenBlurred && !validateOnBlur) {
        validateField(newValue);
      }
    },
    [name, onChange, hasBeenBlurred, validateOnBlur, validateField]
  );

  const handleBlur = useCallback(() => {
    setHasBeenBlurred(true);
    if (validateOnBlur) {
      validateField(value);
    }
  }, [validateOnBlur, validateField, value]);

  const hasError = showValidation && !!error;
  const inputClassName = useMemo(
    () => getInputClassName(hasError),
    [hasError]
  );

  return (
    <OptimizedInputGroupWrapper
      label={label}
      className={labelClassName}
      error={error}
      showError={showValidation && hasBeenBlurred}
    >
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClassName}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
    </OptimizedInputGroupWrapper>
  );
});

/**
 * Performance-optimized textarea that only validates on blur
 */
export const OptimizedTextarea = React.memo(<T extends string>({
  label,
  labelClassName,
  name,
  value = "",
  placeholder,
  onChange,
  validationSchema,
  showValidation = true,
  validateOnBlur = true,
}: OptimizedInputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });
  const [error, setError] = useState<string | undefined>();
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);

  const validateField = useCallback((valueToValidate: string) => {
    if (!validationSchema || !showValidation) {
      setError(undefined);
      return;
    }
    
    try {
      validationSchema.parse(valueToValidate);
      setError(undefined);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message);
      } else {
        setError("Validation error");
      }
    }
  }, [validationSchema, showValidation]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(name, newValue);
      
      // Only validate if the field has been blurred before
      if (hasBeenBlurred && !validateOnBlur) {
        validateField(newValue);
      }
    },
    [name, onChange, hasBeenBlurred, validateOnBlur, validateField]
  );

  const handleBlur = useCallback(() => {
    setHasBeenBlurred(true);
    if (validateOnBlur) {
      validateField(value);
    }
  }, [validateOnBlur, validateField, value]);

  const hasError = showValidation && !!error;
  const textareaClassName = useMemo(
    () => `${getInputClassName(hasError)} resize-none overflow-hidden min-h-[2.5rem]`,
    [hasError]
  );

  return (
    <OptimizedInputGroupWrapper
      label={label}
      className={labelClassName}
      error={error}
      showError={showValidation && hasBeenBlurred}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={textareaClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
    </OptimizedInputGroupWrapper>
  );
});
