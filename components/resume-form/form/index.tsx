import React, { useMemo, useCallback } from "react";
import { cx } from "@/lib/cx";
import { ExpanderWithHeightTransition } from "@/components/expander-with-height-transition";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  LightBulbIcon,
  WrenchIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import {
  addSectionInForm,
  deleteSectionInFormByIdx,
  moveSectionInForm,
} from "@/lib/redux/resume-slice";
import {
  changeFormHeading,
  changeFormOrder,
  changeShowForm,
  selectHeadingByForm,
  selectIsFirstForm,
  selectIsLastForm,
  selectShowByForm,
  ShowForm,
} from "@/lib/redux/settings-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  DeleteIconButton,
  MoveIconButton,
  ShowIconButton,
} from "./icon-button";

/**
 * BaseForm is the bare bone form, i.e. just the outline with no title and no control buttons.
 * ProfileForm uses this to compose its outline.
 */
export const BaseForm = React.memo(
  ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  }) => (
    <section
      className={`flex flex-col gap-3 rounded-md bg-white p-6 pt-4 shadow transition-opacity duration-200 ${className}`}
    >
      {children}
    </section>
  )
  );

const FORM_TO_ICON: { [section in ShowForm]: typeof BuildingOfficeIcon } = {
  workExperiences: BuildingOfficeIcon,
  educations: AcademicCapIcon,
  projects: LightBulbIcon,
  skills: WrenchIcon,
  custom: WrenchIcon,
};

const FormHeader = ({
  form,
  Icon,
  heading,
  onHeadingChange,
  isFirstForm,
  isLastForm,
  showForm,
  onMoveClick,
  onShowFormChange,
}: {
  form: ShowForm;
  Icon: typeof BuildingOfficeIcon;
  heading: string;
  onHeadingChange: (heading: string) => void;
  isFirstForm: boolean;
  isLastForm: boolean;
  showForm: boolean;
  onMoveClick: (type: "up" | "down") => void;
  onShowFormChange: (show: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex grow items-center gap-2">
      <Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
      <input
        type="text"
        className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm focus:border-gray-300 focus:shadow-sm"
        value={heading}
        onChange={(e) => onHeadingChange(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-0.5">
      {!isFirstForm && <MoveIconButton type="up" onClick={onMoveClick} />}
      {!isLastForm && <MoveIconButton type="down" onClick={onMoveClick} />}
      <ShowIconButton show={showForm} setShow={onShowFormChange} />
    </div>
  </div>
);

const AddButton = ({
  addButtonText,
  onAddClick,
}: {
  addButtonText: string;
  onAddClick: () => void;
}) => (
  <div className="mt-2 flex justify-end">
    <button
      type="button"
      onClick={onAddClick}
      className="flex items-center rounded-md bg-white py-2 pl-3 pr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      <PlusSmallIcon
        className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      {addButtonText}
    </button>
  </div>
);

export const Form = React.memo(
  ({
    form,
    addButtonText,
    children,
  }: {
    form: ShowForm;
    addButtonText?: string;
    children: React.ReactNode;
  }) => {
    const showForm = useAppSelector(selectShowByForm(form));
    const heading = useAppSelector(selectHeadingByForm(form));
    const isFirstForm = useAppSelector(selectIsFirstForm(form));
    const isLastForm = useAppSelector(selectIsLastForm(form));

    const dispatch = useAppDispatch();

    // Memoize callbacks to prevent child re-renders
    const handleShowFormChange = useCallback(
      (showForm: boolean) => {
        dispatch(changeShowForm({ field: form, value: showForm }));
      },
      [dispatch, form]
    );

    const handleHeadingChange = useCallback(
      (heading: string) => {
        dispatch(changeFormHeading({ field: form, value: heading }));
      },
      [dispatch, form]
    );

    const handleMoveClick = useCallback(
      (type: "up" | "down") => {
        dispatch(changeFormOrder({ form, type }));
      },
      [dispatch, form]
    );

    const handleAddClick = useCallback(() => {
      dispatch(addSectionInForm({ form }));
    }, [dispatch, form]);

    // Memoize icon to prevent re-creation
    const Icon = useMemo(() => FORM_TO_ICON[form], [form]);

    // Memoize className to prevent re-computation
    const baseFormClassName = useMemo(
      () =>
        `transition-opacity duration-200 ${
          showForm ? "pb-6" : "pb-2 opacity-60"
        }`,
      [showForm]
    );

    return (
      <BaseForm className={baseFormClassName}>
        <FormHeader
          form={form}
          Icon={Icon}
          heading={heading}
          onHeadingChange={handleHeadingChange}
          isFirstForm={isFirstForm}
          isLastForm={isLastForm}
          showForm={showForm}
          onMoveClick={handleMoveClick}
          onShowFormChange={handleShowFormChange}
        />
        <ExpanderWithHeightTransition expanded={showForm}>
          {children}
        </ExpanderWithHeightTransition>
        {showForm && addButtonText && (
          <AddButton
            addButtonText={addButtonText}
            onAddClick={handleAddClick}
          />
        )}
      </BaseForm>
    );
  }
);

export const FormSection = React.memo(
  ({
    form,
    idx,
    showMoveUp,
    showMoveDown,
    showDelete,
    deleteButtonTooltipText,
    children,
  }: {
    form: ShowForm;
    idx: number;
    showMoveUp: boolean;
    showMoveDown: boolean;
    showDelete: boolean;
    deleteButtonTooltipText: string;
    children: React.ReactNode;
  }) => {
    const dispatch = useAppDispatch();

    const handleDeleteClick = useCallback(() => {
      dispatch(deleteSectionInFormByIdx({ form, idx }));
    }, [dispatch, form, idx]);

    const handleMoveClick = useCallback(
      (direction: "up" | "down") => {
        dispatch(moveSectionInForm({ form, direction, idx }));
      },
      [dispatch, form, idx]
    );

    // Memoize button visibility classes with specific transitions for better performance
    const moveUpClasses = useMemo(
      () =>
        `transition-[opacity,visibility,margin] duration-300 ease-out ${
          showMoveUp ? "" : "invisible opacity-0"
        } ${showMoveDown ? "" : "-mr-6"}`,
      [showMoveUp, showMoveDown]
    );

    const moveDownClasses = useMemo(
      () =>
        `transition-[opacity,visibility] duration-300 ease-out ${
          showMoveDown ? "" : "invisible opacity-0"
        }`,
      [showMoveDown]
    );

    const deleteClasses = useMemo(
      () =>
        `transition-[opacity,visibility] duration-300 ease-out ${
          showDelete ? "" : "invisible opacity-0"
        }`,
      [showDelete]
    );

    return (
      <>
        {idx !== 0 && (
          <div className="mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        )}
        <div className="relative grid grid-cols-6 gap-3">
          {children}
          <div className="absolute right-0 top-0 flex gap-0.5">
            <div className={moveUpClasses}>
              <MoveIconButton
                type="up"
                size="small"
                onClick={() => handleMoveClick("up")}
              />
            </div>
            <div className={moveDownClasses}>
              <MoveIconButton
                type="down"
                size="small"
                onClick={() => handleMoveClick("down")}
              />
            </div>
            <div className={deleteClasses}>
              <DeleteIconButton
                onClick={handleDeleteClick}
                tooltipText={deleteButtonTooltipText}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
