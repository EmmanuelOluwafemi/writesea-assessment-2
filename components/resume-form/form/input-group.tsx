import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAutosizeTextareaHeight } from "@/lib/hooks/use-autosize-textarea-height";
import ContentEditable from "react-contenteditable";
import { useFieldValidation } from "@/lib/validation/hooks";
import { z } from "zod";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  // name is passed in as a const string. Therefore, we make it a generic type so its type can
  // be more restricted as a const for the first argument in onChange
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
  validationSchema?: z.ZodSchema<V>;
  showValidation?: boolean;
}

/**
 * InputGroupWrapper wraps a label element around a input children. This is preferable
 * than having input as a sibling since it makes clicking label auto focus input children
 */
export const InputGroupWrapper = ({
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
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border text-gray-900 shadow-sm outline-none font-normal text-base transition-colors duration-200";

const getInputClassName = (hasError: boolean) =>
  `${INPUT_CLASS_NAME} ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  }`;

export const Input = React.memo(<K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
  validationSchema,
  showValidation = false,
}: InputProps<K, string>) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  // Enhanced validation with visual feedback
  const { isValid, error } = useFieldValidation(validationSchema || z.any(), value);
  const shouldShowValidation = showValidation && validationSchema;
  
  const inputClassName = useMemo(
    () => getInputClassName(Boolean(shouldShowValidation && !isValid)),
    [shouldShowValidation, isValid]
  );

  return (
    <InputGroupWrapper 
      label={label} 
      className={labelClassName}
    >
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={inputClassName}
      />
    </InputGroupWrapper>
  );
});

Input.displayName = 'Input';

export const Textarea = React.memo(<T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
  validationSchema,
  showValidation = false,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });
  
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );
  
  // Enhanced validation with visual feedback
  const { isValid, error } = useFieldValidation(validationSchema || z.any(), value);
  const shouldShowValidation = showValidation && validationSchema;
  
  const textareaClassName = useMemo(
    () => `${getInputClassName(Boolean(shouldShowValidation && !isValid))} resize-none overflow-hidden min-h-[2.5rem]`,
    [shouldShowValidation, isValid]
  );

  return (
    <InputGroupWrapper 
      label={label} 
      className={wrapperClassName}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={textareaClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {shouldShowValidation && !isValid && error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </InputGroupWrapper>
  );
});

export const BulletListTextarea = React.memo(<T extends string>(
  props: InputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome"); // Note that Chrome also includes Safari in its userAgent
    if (isFirefox || isSafari) {
      setShowFallback(true);
    }
  }, []);

  if (showFallback) {
    return <BulletListTextareaFallback {...(props as any)} />;
  }
  return <BulletListTextareaGeneral {...(props as any)} />;
});

BulletListTextarea.displayName = 'BulletListTextarea';

/**
 * BulletListTextareaGeneral is a textarea where each new line starts with a bullet point.
 *
 * In its core, it uses a div with contentEditable set to True. However, when
 * contentEditable is True, user can paste in any arbitrary html and it would
 * render. So to make it behaves like a textarea, it strips down all html while
 * keeping only the text part.
 *
 * Reference: https://stackoverflow.com/a/74998090/7699841
 */
const BulletListTextareaGeneral = React.memo(<T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const html = useMemo(() => getHTMLFromBulletListStrings(bulletListStrings), [bulletListStrings]);
  
  const handleChange = useCallback((e: any) => {
    if (e.type === "input") {
      const { innerText } = e.currentTarget as HTMLDivElement;
      const newBulletListStrings = getBulletListStringsFromInnerText(innerText);
      onChange(name as any, newBulletListStrings as any);
    }
  }, [name, onChange]);

  const contentEditableClassName = useMemo(
    () => `${INPUT_CLASS_NAME} cursor-text [&>div]:list-item ${
      showBulletPoints ? "pl-7" : "[&>div]:list-['']"
    }`,
    [showBulletPoints]
  );

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <ContentEditable
        contentEditable={true}
        className={contentEditableClassName}
        placeholder={placeholder}
        onChange={handleChange}
        html={html}
      />
    </InputGroupWrapper>
  );
});

const NORMALIZED_LINE_BREAK = "\n";
/**
 * Normalize line breaks to be \n since different OS uses different line break
 *    Windows -> \r\n (CRLF)
 *    Unix    -> \n (LF)
 *    Mac     -> \n (LF), or \r (CR) for earlier versions
 */
const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);
const dedupeLineBreak = (str: string) =>
  str.replace(/\n\n/g, NORMALIZED_LINE_BREAK);
const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const getBulletListStringsFromInnerText = (innerText: string) => {
  const innerTextWithNormalizedLineBreak = normalizeLineBreak(innerText);

  // In Windows Chrome, pressing enter creates 2 line breaks "\n\n"
  // This dedupes it into 1 line break "\n"
  let newInnerText = dedupeLineBreak(innerTextWithNormalizedLineBreak);

  // Handle the special case when content is empty
  if (newInnerText === NORMALIZED_LINE_BREAK) {
    newInnerText = "";
  }

  return getStringsByLineBreak(newInnerText);
};

const getHTMLFromBulletListStrings = (bulletListStrings: string[]) => {
  // If bulletListStrings is an empty array, make it an empty div
  if (bulletListStrings.length === 0) {
    return "<div></div>";
  }

  return bulletListStrings.map((text) => `<div>${text}</div>`).join("");
};

/**
 * BulletListTextareaFallback is a fallback for BulletListTextareaGeneral to work around
 * content editable div issue in some browsers. For example, in Firefox, if user enters
 * space in the content editable div at the end of line, Firefox returns it as a new
 * line character \n instead of space in innerText.
 */
const BulletListTextareaFallback = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(
    bulletListStrings,
    showBulletPoints
  );

  return (
    <Textarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={(name, value) => {
        onChange(
          name as any,
          getBulletListStringsFromTextareaValue(value, showBulletPoints)
        );
      }}
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
    // Filter out empty strings
    const nonEmptyStrings = strings.filter((s) => s !== "•");

    let newStrings: string[] = [];
    for (let string of nonEmptyStrings) {
      if (string.startsWith("• ")) {
        newStrings.push(string.slice(2));
      } else if (string.startsWith("•")) {
        // Handle the special case when user wants to delete the bullet point, in which case
        // we combine it with the previous line if previous line exists
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
