import React, { useCallback, useMemo } from "react";
import { useAutosizeTextareaHeight } from "@/lib/hooks/use-autosize-textarea-height";
import { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { useFieldValidation } from "@/lib/validation/hooks";
import { z } from "zod";

interface ValidatedInputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
  validationSchema?: z.ZodSchema<V>;
  showValidation?: boolean;
}

/**
 * Enhanced InputGroupWrapper with validation support
 */
export const ValidatedInputGroupWrapper = ({
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
  <div className="w-full">
    <label className={`text-base font-medium text-gray-700 ${className}`}>
      {label}
      {children}
    </label>
    {showError && error && (
      <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
    )}
  </div>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border text-gray-900 shadow-sm outline-none font-normal text-base transition-colors duration-200";

export const getInputClassName = (hasError: boolean) =>
  `${INPUT_CLASS_NAME} ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  }`;

export const ValidatedInput = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
  validationSchema,
  showValidation = true,
}: ValidatedInputProps<K, string>) => {
  const validation = useFieldValidation(validationSchema || z.string(), value);
  const hasError = showValidation && !validation.isValid;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  const inputClassName = useMemo(
    () => getInputClassName(hasError),
    [hasError]
  );

  return (
    <ValidatedInputGroupWrapper
      label={label}
      className={labelClassName}
      error={validation.error}
      showError={showValidation}
    >
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={inputClassName}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
    </ValidatedInputGroupWrapper>
  );
};

export const ValidatedTextarea = <T extends string>({
  label,
  labelClassName,
  name,
  value = "",
  placeholder,
  onChange,
  validationSchema,
  showValidation = true,
}: ValidatedInputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });
  const validation = useFieldValidation(validationSchema || z.string(), value);
  const hasError = showValidation && !validation.isValid;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  const textareaClassName = useMemo(
    () => `${getInputClassName(hasError)} resize-none overflow-hidden`,
    [hasError]
  );

  return (
    <ValidatedInputGroupWrapper
      label={label}
      className={labelClassName}
      error={validation.error}
      showError={showValidation}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={textareaClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
    </ValidatedInputGroupWrapper>
  );
};

export const ValidatedBulletListTextarea = <T extends string>(
  props: ValidatedInputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    if (isFirefox || isSafari) {
      setShowFallback(true);
    }
  }, []);

  if (showFallback) {
    return <ValidatedBulletListTextareaFallback {...props} />;
  }
  return <ValidatedBulletListTextareaGeneral {...props} />;
};

/**
 * Enhanced BulletListTextarea with validation
 */
const ValidatedBulletListTextareaGeneral = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
  validationSchema,
  showValidation = true,
}: ValidatedInputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const validation = useFieldValidation(
    validationSchema || z.array(z.string()),
    bulletListStrings
  );
  const hasError = showValidation && !validation.isValid;
  const html = getHTMLFromBulletListStrings(bulletListStrings);

  const handleChange = useCallback(
    (e: any) => {
      if (e.type === "input") {
        const { innerText } = e.currentTarget as HTMLDivElement;
        const newBulletListStrings =
          getBulletListStringsFromInnerText(innerText);
        onChange(name, newBulletListStrings);
      }
    },
    [name, onChange]
  );

  const contentEditableClassName = useMemo(
    () =>
      `${getInputClassName(hasError)} cursor-text [&>div]:list-item ${
        showBulletPoints ? "pl-7" : "[&>div]:list-['']"
      }`,
    [hasError, showBulletPoints]
  );

  return (
    <ValidatedInputGroupWrapper
      label={label}
      className={labelClassName}
      error={validation.error}
      showError={showValidation}
    >
      <ContentEditable
        contentEditable={true}
        className={contentEditableClassName}
        placeholder={placeholder}
        onChange={handleChange}
        html={html}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
    </ValidatedInputGroupWrapper>
  );
};

const NORMALIZED_LINE_BREAK = "\n";

const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);
const dedupeLineBreak = (str: string) =>
  str.replace(/\n\n/g, NORMALIZED_LINE_BREAK);
const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const getBulletListStringsFromInnerText = (innerText: string) => {
  const innerTextWithNormalizedLineBreak = normalizeLineBreak(innerText);
  let newInnerText = dedupeLineBreak(innerTextWithNormalizedLineBreak);

  if (newInnerText === NORMALIZED_LINE_BREAK) {
    newInnerText = "";
  }

  return getStringsByLineBreak(newInnerText);
};

const getHTMLFromBulletListStrings = (bulletListStrings: string[]) => {
  if (bulletListStrings.length === 0) {
    return "<div></div>";
  }

  return bulletListStrings.map((text) => `<div>${text}</div>`).join("");
};

/**
 * Fallback version for browsers with ContentEditable issues
 */
const ValidatedBulletListTextareaFallback = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
  validationSchema,
  showValidation = true,
}: ValidatedInputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(
    bulletListStrings,
    showBulletPoints
  );

  const handleChange = useCallback(
    (textareaName: T, value: string) => {
      onChange(
        name,
        getBulletListStringsFromTextareaValue(value, showBulletPoints)
      );
    },
    [name, onChange, showBulletPoints]
  );

  return (
    <ValidatedTextarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={handleChange}
      validationSchema={validationSchema as any}
      showValidation={showValidation}
    />
  );
};

const getTextareaValueFromBulletListStrings = (
  bulletListStrings: string[],
  showBulletPoints: boolean
) => {
  const prefix = showBulletPoints ? "• " : "";

  if (bulletListStrings.length === 0) {
    return prefix;
  }

  let value = "";
  for (let i = 0; i < bulletListStrings.length; i++) {
    const string = bulletListStrings[i];
    const isLastItem = i === bulletListStrings.length - 1;
    value += `${prefix}${string}${isLastItem ? "" : "\r\n"}`;
  }
  return value;
};

const getBulletListStringsFromTextareaValue = (
  textareaValue: string,
  showBulletPoints: boolean
) => {
  const textareaValueWithNormalizedLineBreak =
    normalizeLineBreak(textareaValue);

  const strings = getStringsByLineBreak(textareaValueWithNormalizedLineBreak);

  if (showBulletPoints) {
    const nonEmptyStrings = strings.filter((s) => s !== "•");

    let newStrings: string[] = [];
    for (let string of nonEmptyStrings) {
      if (string.startsWith("• ")) {
        newStrings.push(string.slice(2));
      } else if (string.startsWith("•")) {
        const lastItemIdx = newStrings.length - 1;
        if (lastItemIdx >= 0) {
          const lastItem = newStrings[lastItemIdx];
          newStrings[lastItemIdx] = `${lastItem}${string.slice(1)}`;
        } else {
          newStrings.push(string.slice(1));
        }
      } else {
        newStrings.push(string);
      }
    }
    return newStrings;
  }

  return strings;
};
