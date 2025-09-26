import React, { useMemo, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { changeProjects, selectProjects } from "@/lib/redux/resume-slice";
import { ResumeProject } from "@/lib/redux/types";
import { Form, FormSection } from "./form";
import { BulletListTextarea, Input } from "./form/input-group";
import { z } from "zod";

export const ProjectsForm = React.memo(() => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  // Validation schemas for project fields
  const validationSchemas = useMemo(() => ({
    project: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
    date: z.string().min(1, "Date is required").max(50, "Date must be less than 50 characters"),
  }), []);

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          field: keyof ResumeProject,
          value: string | string[]
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };

        // Create wrapper functions for Input components
        const handleProjectNameChange = (name: string, value: string) => {
          handleProjectChange("project", value);
        };
        
        const handleDateChange = (name: string, value: string) => {
          handleProjectChange("date", value);
        };
        
        const handleDescriptionsChange = (name: string, value: string[]) => {
          handleProjectChange("descriptions", value);
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="OpenResume"
              value={project}
              onChange={handleProjectNameChange}
              labelClassName="col-span-4"
              validationSchema={validationSchemas.project}
              showValidation={true}
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleDateChange}
              labelClassName="col-span-2"
              validationSchema={validationSchemas.date}
              showValidation={true}
            />
            <BulletListTextarea
              name="descriptions"
              label="Description"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleDescriptionsChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
});

ProjectsForm.displayName = 'ProjectsForm';
