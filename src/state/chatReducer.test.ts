import { describe, expect, it } from "vitest";
import { chatReducer, initialChatState } from "./chatReducer";
import type { ChatState } from "../types/chat";
import type { StepState } from "../types/steps";

const buildStateWithSteps = (statuses: StepState["status"][]): ChatState => {
  const steps: StepState[] = statuses.map((status, index) => ({
    id: `step-${index + 1}`,
    title: `Step ${index + 1}`,
    acceptedMimeTypes: [],
    maxSizeMB: 10,
    requiredFields: [],
    validationHint: "",
    status
  }));
  return {
    ...initialChatState,
    steps,
    activeStepId: steps[0]?.id ?? null
  };
};

describe("chatReducer NEXT_STEP", () => {
  it("mantiene el paso activo cuando no hay siguiente pendiente", () => {
    const state = buildStateWithSteps(["done", "done"]);
    const next = chatReducer(state, { type: "NEXT_STEP" });
    expect(next.activeStepId).toBe(state.activeStepId);
  });

  it("avanza al siguiente paso pendiente", () => {
    const state = buildStateWithSteps(["done", "pending", "pending"]);
    const next = chatReducer(state, { type: "NEXT_STEP" });
    expect(next.activeStepId).toBe("step-2");
    const activeStep = next.steps.find((s) => s.id === "step-2");
    expect(activeStep?.status).toBe("active");
  });
});

