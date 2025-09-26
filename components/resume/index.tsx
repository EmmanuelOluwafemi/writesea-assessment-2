"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectResume } from "@/lib/redux/resume-slice";
import { selectSettings } from "@/lib/redux/settings-slice";
import { useMemo, useState } from "react";
import { ResumePDF } from "./resume-pdf";
import { useRegisterReactPDFFont, useRegisterReactPDFHyphenationCallback } from "../fonts/hooks";
import { FlexboxSpacer } from "../flexbox-spacer";
import { ResumeIframeCSR } from "./resume-iframe";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/constants";



export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback("Roboto");

  return (
    <>
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <ResumeIframeCSR
              documentSize={"Letter"}
              scale={scale}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={DEBUG_RESUME_PDF_FLAG}
              />
            </ResumeIframeCSR>
          </section>
        </div>
      </div>
    </>
  );
};
