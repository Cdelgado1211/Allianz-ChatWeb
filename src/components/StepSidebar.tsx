import type { StepState } from "../types/steps";

interface Props {
  steps: StepState[];
  activeStepId: string | null;
}

export const StepSidebar: React.FC<Props> = ({ steps, activeStepId }) => {
  const getStatusLabel = (status: StepState["status"]) => {
    switch (status) {
      case "active":
        return "En progreso";
      case "done":
        return "Completo";
      case "error":
        return "Revisar";
      default:
        return "Pendiente";
    }
  };

  return (
    <nav
      aria-label="Progreso del trámite"
      className="hidden w-72 flex-none border-r border-border bg-surface/60 p-4 lg:block"
    >
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Pasos del prerregistro</h2>
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          return (
            <li key={step.id}>
              <div
                className={[
                  "flex items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                  isActive ? "border-primary bg-primary-subtle" : "border-border bg-white"
                ].join(" ")}
              >
                <div
                  className={[
                    "mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    step.status === "done"
                      ? "bg-success text-white"
                      : step.status === "error"
                      ? "bg-danger text-white"
                      : isActive
                      ? "bg-primary text-white"
                      : "bg-slate-200 text-slate-700"
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-600">{getStatusLabel(step.status)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

