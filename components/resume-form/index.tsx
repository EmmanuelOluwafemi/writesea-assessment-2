"use client";
import React, { useState } from "react";
import { selectFormsOrder, selectShowByForm, ShowForm } from "@/lib/redux/settings-slice";
import { WorkExperiencesForm } from "./work-experiences-form";
import { EducationsForm } from "./educations-form";
import { ProjectsForm } from "./projects-form";
import { SkillsForm } from "./skills-form";
import { CustomForm } from "./custom-form";
import { useAppSelector, useSaveStateToLocalStorageOnChange, useSetInitialStore } from "@/lib/redux/hooks";
import { ProfileForm } from "./profile-form";
import { FlexboxSpacer } from "../flexbox-spacer";
import { cx } from "@/lib/cx";

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

// Conditional form renderer component
const ConditionalFormRenderer = React.memo(({ form }: { form: ShowForm }) => {
  const showForm = useAppSelector(selectShowByForm(form));
  
  // Early return if form should not be shown - prevents component from mounting
  if (!showForm) {
    return null;
  }
  
  const Component = formTypeToComponent[form];
  return <Component />;
});

// Add display name for better debugging
ConditionalFormRenderer.displayName = 'ConditionalFormRenderer';
