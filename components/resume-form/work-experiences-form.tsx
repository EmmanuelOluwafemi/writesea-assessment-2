import React, { useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "@/lib/redux/resume-slice";
import { ResumeWorkExperience } from "@/lib/redux/types";
import { Form, FormSection } from "./form";
import { BulletListTextarea, Input } from "./form/input-group";
import { workExperienceSchema } from "@/lib/validation/schemas";
import { z } from "zod";

// Extract WorkExperienceItem to fix map function anti-pattern
const WorkExperienceItem = React.memo(({ 
  workExperience, 
  idx, 
  showMoveUp, 
  showMoveDown, 
  showDelete, 
  onUpdate 
}: {
  workExperience: ResumeWorkExperience;
  idx: number;
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  onUpdate: (idx: number, field: keyof ResumeWorkExperience, value: string | string[]) => void;
}) => {
  const { company, jobTitle, date, descriptions } = workExperience;

  // Validation schemas for work experience fields
  const validationSchemas = useMemo(() => ({
    company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
    jobTitle: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
    date: z.string().min(1, "Date is required").max(50, "Date must be less than 50 characters"),
  }), []);

  // Memoized wrapper functions with stable references
  const handleCompanyChange = useCallback((name: string, value: string) => {
    onUpdate(idx, "company", value);
  }, [idx, onUpdate]);
  
  const handleJobTitleChange = useCallback((name: string, value: string) => {
    onUpdate(idx, "jobTitle", value);
  }, [idx, onUpdate]);
  
  const handleDateChange = useCallback((name: string, value: string) => {
    onUpdate(idx, "date", value);
  }, [idx, onUpdate]);
  
  const handleDescriptionsChange = useCallback((name: string, value: string[]) => {
    onUpdate(idx, "descriptions", value);
  }, [idx, onUpdate]);

  return (
    <FormSection
      form="workExperiences"
      idx={idx}
      showMoveUp={showMoveUp}
      showMoveDown={showMoveDown}
      showDelete={showDelete}
      deleteButtonTooltipText="Delete job"
    >
      <Input
        label="Company"
        labelClassName="col-span-full"
        name="company"
        placeholder="Khan Academy"
        value={company}
        onChange={handleCompanyChange}
        validationSchema={validationSchemas.company}
        showValidation={true}
      />
      <Input
        label="Job Title"
        labelClassName="col-span-4"
        name="jobTitle"
        placeholder="Software Engineer"
        value={jobTitle}
        onChange={handleJobTitleChange}
        validationSchema={validationSchemas.jobTitle}
        showValidation={true}
      />
      <Input
        label="Date"
        labelClassName="col-span-2"
        name="date"
        placeholder="Jun 2022 - Present"
        value={date}
        onChange={handleDateChange}
        validationSchema={validationSchemas.date}
        showValidation={true}
      />
      <BulletListTextarea
        label="Description"
        labelClassName="col-span-full"
        name="descriptions"
        placeholder="Bullet points"
        value={descriptions}
        onChange={handleDescriptionsChange}
      />
    </FormSection>
  );
});

WorkExperienceItem.displayName = 'WorkExperienceItem';

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  // Single stable callback for all updates
  const handleUpdate = useCallback((idx: number, field: keyof ResumeWorkExperience, value: string | string[]) => {
    dispatch(changeWorkExperiences({ idx, field, value } as any));
  }, [dispatch]);

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map((workExperience, idx) => {
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;
        
        return (
          <WorkExperienceItem
            key={idx}
            workExperience={workExperience}
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            onUpdate={handleUpdate}
          />
        );
      })}
    </Form>
  );
};

WorkExperiencesForm.displayName = 'WorkExperiencesForm';
