import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeCustom, selectCustom } from "@/lib/redux/resume-slice";
import { changeShowBulletPoints, selectShowBulletPoints } from "@/lib/redux/settings-slice";
import { Form } from "./form";
import { BulletListTextarea } from "./form/input-group";
import { BulletListIconButton } from "./form/icon-button";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const dispatch = useAppDispatch();
  const { descriptions } = custom;
  const form = "custom";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  const handleCustomChange = (field: "descriptions", value: string[]) => {
    dispatch(changeCustom({ field, value }));
  };

  // Wrapper function for BulletListTextarea component
  const handleDescriptionsChange = (name: string, value: string[]) => {
    handleCustomChange("descriptions", value);
  };

  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleDescriptionsChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

CustomForm.displayName = 'CustomForm';
