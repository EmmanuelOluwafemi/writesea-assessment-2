"use client";
import { selectFormsOrder, ShowForm } from "@/lib/redux/settings-slice";
import { useState } from "react";
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
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
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
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        {/* <ThemeForm /> */}
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
