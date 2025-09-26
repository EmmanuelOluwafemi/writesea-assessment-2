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
      <div className="flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div 
          className="sticky top-[var(--top-nav-bar-height)] bg-white shadow-lg rounded-lg border border-gray-200"
          style={{
            height: "calc(100vh - var(--top-nav-bar-height) - var(--resume-control-bar-height) - 2rem)",
            width: "fit-content",
            maxWidth: "90vw",
          }}
        >
          <div 
            className="h-full overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 p-4"
          >
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
          </div>
        </div>
      </div>
    </>
  );
};
