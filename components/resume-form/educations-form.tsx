import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeEducations, selectEducations } from "@/lib/redux/resume-slice";
import { changeShowBulletPoints, selectShowBulletPoints } from "@/lib/redux/settings-slice";
import { Form, FormSection } from "./form";
import { CreateHandleChangeArgsWithDescriptions } from "./types";
import { ResumeEducation } from "@/lib/redux/types";
import { BulletListTextarea, Input } from "./form/input-group";
import { BulletListIconButton } from "./form/icon-button";

export const EducationsForm = React.memo(() => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          dispatch(changeEducations({ idx, field, value } as any));
        };

        // Create wrapper functions for Input components
        const handleSchoolChange = (name: string, value: string) => {
          handleEducationChange("school", value);
        };
        
        const handleDegreeChange = (name: string, value: string) => {
          handleEducationChange("degree", value);
        };
        
        const handleGpaChange = (name: string, value: string) => {
          handleEducationChange("gpa", value);
        };
        
        const handleDateChange = (name: string, value: string) => {
          handleEducationChange("date", value);
        };
        
        const handleDescriptionsChange = (name: string, value: string[]) => {
          handleEducationChange("descriptions", value);
        };

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete school"
          >
            <Input
              label="School"
              labelClassName="col-span-4"
              name="school"
              placeholder="Cornell University"
              value={school}
              onChange={handleSchoolChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="May 2018"
              value={date}
              onChange={handleDateChange}
            />
            <Input
              label="Degree & Major"
              labelClassName="col-span-4"
              name="degree"
              placeholder="Bachelor of Science in Computer Engineering"
              value={degree}
              onChange={handleDegreeChange}
            />
            <Input
              label="GPA"
              labelClassName="col-span-2"
              name="gpa"
              placeholder="3.81"
              value={gpa}
              onChange={handleGpaChange}
            />
            <div className="relative col-span-full">
              <BulletListTextarea
                label="Additional Information (Optional)"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleDescriptionsChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={() => handleShowBulletPoints(!showBulletPoints)}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
});

EducationsForm.displayName = 'EducationsForm';
