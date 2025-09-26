import React, { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "@/lib/redux/resume-slice";
import { ResumeWorkExperience } from "@/lib/redux/types";
import { Form, FormSection } from "./form";
import { BulletListTextarea, Input } from "./form/input-group";

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
      />
      <Input
        label="Job Title"
        labelClassName="col-span-4"
        name="jobTitle"
        placeholder="Software Engineer"
        value={jobTitle}
        onChange={handleJobTitleChange}
      />
      <Input
        label="Date"
        labelClassName="col-span-2"
        name="date"
        placeholder="Jun 2022 - Present"
        value={date}
        onChange={handleDateChange}
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
