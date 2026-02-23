import type { StepState } from "../types/steps";
import { useState } from "react";

interface Props {
  steps: StepState[];
  activeStepId: string | null;
}

export const ProgressMobile: React.FC<Props> = ({ steps, activeStepId }) => {
  const [open, setOpen] = useState(false);
  const completed = steps.filter((s) => s.status === "done").length;

  return (
    <section className="border-b border-border bg-surface px-4 py-2 lg:hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-left text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-progress-panel"
      >
        <span>
          Progreso: {completed}/{steps.length} pasos
        </span>
        <span className="text-xs text-slate-500">{open ? "Contraer" : "Ver pasos"}</span>
      </button>
      {open && (
        <div
          id="mobile-progress-panel"
          className="mt-2 rounded-md border border-border bg-white p-3 text-xs"
        >
          <ol className="space-y-1">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center justify-between">
                <span
                  className={
                    step.id === activeStepId ? "font-medium text-primary" : "text-slate-700"
                  }
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-500">{step.status}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};

