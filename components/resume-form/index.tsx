"use client";
import React, { useState } from "react";
import { selectFormsOrder, selectShowByForm, ShowForm, selectHeadingByForm, changeShowForm } from "@/lib/redux/settings-slice";
import { WorkExperiencesForm } from "./work-experiences-form";
import { EducationsForm } from "./educations-form";
import { ProjectsForm } from "./projects-form";
import { SkillsForm } from "./skills-form";
import { CustomForm } from "./custom-form";
import { useAppSelector, useAppDispatch, useSaveStateToLocalStorageOnChange, useSetInitialStore } from "@/lib/redux/hooks";
import { ProfileForm } from "./profile-form";
import { FlexboxSpacer } from "../flexbox-spacer";
import { cx } from "@/lib/cx";
import { EyeIcon } from "@heroicons/react/24/outline";

const formTypeToComponent: { [type in ShowForm]: () => React.ReactNode } = {
  workExperiences: WorkExperiencesForm as any,
  educations: EducationsForm as any,
  projects: ProjectsForm as any,
  skills: SkillsForm as any,
  custom: CustomForm as any,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();
  
  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cx(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <ProfileForm />
        {formsOrder.map((form) => (
          <ConditionalFormRenderer key={form} form={form} />
        ))}
        {/* <ThemeForm /> */}
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};

// Collapsed form header component - shows when form is hidden to allow re-enabling
const CollapsedFormHeader = React.memo(({ form }: { form: ShowForm }) => {
  const dispatch = useAppDispatch();
  const heading = useAppSelector(selectHeadingByForm(form));
  
  const handleShowForm = () => {
    dispatch(changeShowForm({ field: form, value: true }));
  };
  
  return (
    <div className="group relative rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 transition-all hover:border-gray-400 hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-gray-500">
            {heading} (Hidden)
          </div>
        </div>
        <button
          onClick={handleShowForm}
          className="flex items-center space-x-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title={`Show ${heading} section`}
        >
          <EyeIcon className="h-4 w-4" />
          <span>Show Section</span>
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Click "Show Section" to add this section back to your resume
      </div>
    </div>
  );
});

CollapsedFormHeader.displayName = 'CollapsedFormHeader';

// Conditional form renderer component
const ConditionalFormRenderer = React.memo(({ form }: { form: ShowForm }) => {
  const showForm = useAppSelector(selectShowByForm(form));
  
  // If form is hidden, show a collapsed header to allow re-enabling
  if (!showForm) {
    return <CollapsedFormHeader form={form} />;
  }
  
  const Component = formTypeToComponent[form];
  return <Component />;
});

// Add display name for better debugging
ConditionalFormRenderer.displayName = 'ConditionalFormRenderer';
