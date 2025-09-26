import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { useAppSelector } from '@/lib/redux/hooks';
import { 
  selectProfile, 
  selectWorkExperiences, 
  selectEducations, 
  selectProjects, 
  selectSkills, 
  selectCustom
} from '@/lib/redux/resume-slice';
import { 
  profileSchema, 
  workExperienceSchema, 
  educationSchema, 
  projectSchema, 
  skillsSchema, 
  customSchema
} from './schemas';

// Debounced validation hook - only validates after user stops typing
export function useDebouncedFieldValidation<T>(
  schema: z.ZodSchema<T>,
  value: T,
  delay: number = 300
): { isValid: boolean; error?: string; isValidating: boolean } {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    error?: string;
    isValidating: boolean;
  }>({ isValid: true, isValidating: false });

  const validate = useCallback((valueToValidate: T) => {
    try {
      schema.parse(valueToValidate);
      setValidationState({ isValid: true, isValidating: false });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationState({
          isValid: false,
          error: error.issues[0]?.message,
          isValidating: false,
        });
      } else {
        setValidationState({
          isValid: false,
          error: "Validation error",
          isValidating: false,
        });
      }
    }
  }, [schema]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setValidationState((prev: any) => ({ ...prev, isValidating: true }));

    timeoutRef.current = setTimeout(() => {
      validate(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, validate]);

  return validationState;
}

// Immediate validation hook for critical fields (like required fields)
export function useFieldValidation<T>(
  schema: z.ZodSchema<T>,
  value: T
): { isValid: boolean; error?: string } {
  return useMemo(() => {
    try {
      schema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.issues[0]?.message };
      }
      return { isValid: false, error: "Validation error" };
    }
  }, [schema, value]);
}

// Validation state hook for entire form sections
export function useFormValidationState(formType: 'profile' | 'workExperience' | 'education' | 'project' | 'skills' | 'custom', idx?: number) {
  const profile = useAppSelector(selectProfile);
  const workExperiences = useAppSelector(selectWorkExperiences);
  const educations = useAppSelector(selectEducations);
  const projects = useAppSelector(selectProjects);
  const skills = useAppSelector(selectSkills);
  const custom = useAppSelector(selectCustom);

  return useMemo(() => {
    try {
      switch (formType) {
        case 'profile':
          profileSchema.parse(profile);
          return { isValid: true, errors: [] };
        case 'workExperience':
          if (idx !== undefined && workExperiences[idx]) {
            workExperienceSchema.parse(workExperiences[idx]);
          }
          return { isValid: true, errors: [] };
        case 'education':
          if (idx !== undefined && educations[idx]) {
            educationSchema.parse(educations[idx]);
          }
          return { isValid: true, errors: [] };
        case 'project':
          if (idx !== undefined && projects[idx]) {
            projectSchema.parse(projects[idx]);
          }
          return { isValid: true, errors: [] };
        case 'skills':
          skillsSchema.parse(skills);
          return { isValid: true, errors: [] };
        case 'custom':
          customSchema.parse(custom);
          return { isValid: true, errors: [] };
        default:
          return { isValid: true, errors: [] };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          errors: error.issues.map((err: any) => ({ field: err.path.join('.'), message: err.message }))
        };
      }
      return { isValid: false, errors: [{ field: 'unknown', message: 'Validation error' }] };
    }
  }, [formType, idx, profile, workExperiences, educations, projects, skills, custom]);
}

// Simple validation hooks for specific form types
export function useProfileValidation() {
  const profile = useAppSelector(selectProfile);
  return useFieldValidation(profileSchema, profile);
}

export function useWorkExperienceValidation(idx: number) {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const workExperience = workExperiences[idx];
  return useFieldValidation(workExperienceSchema, workExperience);
}

export function useEducationValidation(idx: number) {
  const educations = useAppSelector(selectEducations);
  const education = educations[idx];
  return useFieldValidation(educationSchema, education);
}

export function useProjectValidation(idx: number) {
  const projects = useAppSelector(selectProjects);
  const project = projects[idx];
  return useFieldValidation(projectSchema, project);
}

export function useSkillsValidation() {
  const skills = useAppSelector(selectSkills);
  return useFieldValidation(skillsSchema, skills);
}

export function useCustomValidation() {
  const custom = useAppSelector(selectCustom);
  return useFieldValidation(customSchema, custom);
}
