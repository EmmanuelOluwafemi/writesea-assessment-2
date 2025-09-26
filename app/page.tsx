import { Resume } from "@/components/resume";
import { ResumeForm } from "@/components/resume-form";
import { ReduxProvider } from "@/provider/redux-provider";

export default function Home() {
  return (
    <ReduxProvider>
      <main className="relative h-screen w-full bg-gray-50 px-8 py-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-full">
          <div className="md:col-span-3 h-full overflow-y-auto pr-2">
            <ResumeForm />
          </div>
          <div className="md:col-span-3 h-full overflow-y-auto pl-2">
            <div className="sticky top-0">
              <Resume />
            </div>
          </div>
        </div>
      </main>
    </ReduxProvider>
  );
}