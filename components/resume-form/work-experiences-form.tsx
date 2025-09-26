import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "@/lib/redux/resume-slice";
import { CreateHandleChangeArgsWithDescriptions } from "./types";
import { ResumeWorkExperience } from "@/lib/redux/types";
import { Form, FormSection } from "./form";
import { BulletListTextarea, Input } from "./form/input-group";

export const WorkExperiencesForm = React.memo(() => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };

        // Create wrapper functions for Input components
        const handleCompanyChange = (name: string, value: string) => {
          handleWorkExperienceChange("company", value);
        };
        
        const handleJobTitleChange = (name: string, value: string) => {
          handleWorkExperienceChange("jobTitle", value);
        };
        
        const handleDateChange = (name: string, value: string) => {
          handleWorkExperienceChange("date", value);
        };
        
        const handleDescriptionsChange = (name: string, value: string[]) => {
          handleWorkExperienceChange("descriptions", value);
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;
        return (
          <FormSection
            key={idx}
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
      })}
    </Form>
  );
});

WorkExperiencesForm.displayName = 'WorkExperiencesForm';
