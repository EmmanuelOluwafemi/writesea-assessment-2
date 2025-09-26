import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeProfile, selectProfile } from "@/lib/redux/resume-slice";
import { ResumeProfile } from "@/lib/redux/types";
import { BaseForm } from "./form";
import { OptimizedInput, OptimizedTextarea } from "./form/optimized-input-group";
import { z } from "zod";

export const ProfileForm = React.memo(() => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;

  // Memoized change handlers to prevent re-creation on every render
  const handleNameChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  const handleSummaryChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  const handleEmailChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  const handlePhoneChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  const handleUrlChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  const handleLocationChange = useMemo(() => (name: string, value: string) => {
    dispatch(changeProfile({ field: name as keyof ResumeProfile, value }));
  }, [dispatch]);

  // Memoized validation schemas to prevent re-creation on every render
  const validationSchemas = useMemo(() => ({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().refine((val) => val === "" || z.string().email().safeParse(val).success, "Please enter a valid email address"),
    phone: z.string(),
    url: z.string(),
    summary: z.string(),
    location: z.string(),
  }), []);

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <OptimizedInput
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleNameChange}
          validationSchema={validationSchemas.name}
          validateOnBlur={true}
        />
        <OptimizedTextarea
          label="Objective"
          labelClassName="col-span-full"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleSummaryChange}
          validationSchema={validationSchemas.summary}
          validateOnBlur={true}
        />
        <OptimizedInput
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleEmailChange}
          validationSchema={validationSchemas.email}
          validateOnBlur={true}
        />
        <OptimizedInput
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handlePhoneChange}
          validationSchema={validationSchemas.phone}
          validateOnBlur={true}
        />
        <OptimizedInput
          label="Website"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleUrlChange}
          validationSchema={validationSchemas.url}
          validateOnBlur={true}
        />
        <OptimizedInput
          label="Location"
          labelClassName="col-span-2"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleLocationChange}
          validationSchema={validationSchemas.location}
          validateOnBlur={true}
        />
      </div>
    </BaseForm>
  );
});

ProfileForm.displayName = 'ProfileForm';
