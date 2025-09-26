import { z } from 'zod';

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  url: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
});

// Work experience validation schema
export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  jobTitle: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  date: z.string().min(1, "Date is required").max(50, "Date must be less than 50 characters"),
  descriptions: z.array(z.string()).default([]),
});

// Education validation schema
export const educationSchema = z.object({
  school: z.string().min(1, "School name is required").max(100, "School name must be less than 100 characters"),
  degree: z.string().min(1, "Degree is required").max(100, "Degree must be less than 100 characters"),
  gpa: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required").max(50, "Date must be less than 50 characters"),
  descriptions: z.array(z.string()).default([]),
});

// Project validation schema
export const projectSchema = z.object({
  project: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
  date: z.string().min(1, "Date is required").max(50, "Date must be less than 50 characters"),
  descriptions: z.array(z.string()).default([]),
});

// Featured skill validation schema
export const featuredSkillSchema = z.object({
  skill: z.string().max(50, "Skill name must be less than 50 characters"),
  rating: z.number().min(0).max(5).default(4),
});

// Skills validation schema
export const skillsSchema = z.object({
  featuredSkills: z.array(featuredSkillSchema).default([]),
  descriptions: z.array(z.string()).default([]),
});

// Custom section validation schema
export const customSchema = z.object({
  descriptions: z.array(z.string()).default([]),
});

// Combined resume validation schema
export const resumeSchema = z.object({
  profile: profileSchema,
  workExperiences: z.array(workExperienceSchema).default([]),
  educations: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: skillsSchema,
  custom: customSchema,
});

// Export inferred types
export type ProfileFormData = z.infer<typeof profileSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type FeaturedSkillFormData = z.infer<typeof featuredSkillSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
export type CustomFormData = z.infer<typeof customSchema>;
export type ResumeFormData = z.infer<typeof resumeSchema>;

// Validation helper functions
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message };
    }
    return { isValid: false, error: "Validation error" };
  }
};

// Schema map for easy access
export const schemaMap = {
  profile: profileSchema,
  workExperience: workExperienceSchema,
  education: educationSchema,
  project: projectSchema,
  skills: skillsSchema,
  custom: customSchema,
} as const;
