import { describe, expect, it } from "vitest";
import { getBotMessageOnValidationOk, getBotMessageOnValidationFail, getBotPromptForStep } from "./bot";
import type { StepState } from "../types/steps";

const sampleStep: StepState = {
  id: "identificacion",
  title: "Identificación",
  acceptedMimeTypes: [],
  maxSizeMB: 10,
  requiredFields: ["Nombre", "Fecha"],
  validationHint: "Sube tu identificación.",
  status: "active"
};

describe("bot messages", () => {
  it("incluye el título del paso en mensaje OK", () => {
    const text = getBotMessageOnValidationOk(sampleStep);
    expect(text).toContain(sampleStep.title);
  });

  it("lista los issues en mensaje de fallo", () => {
    const text = getBotMessageOnValidationFail(sampleStep, [
      { code: "MISSING_FIELD", message: "Falta el nombre" }
    ]);
    expect(text).toContain("Falta el nombre");
  });

  it("incluye los campos requeridos en el prompt del paso", () => {
    const text = getBotPromptForStep(sampleStep);
    expect(text).toContain("Nombre");
    expect(text).toContain("Fecha");
  });
});

