import type { StepState } from "../types/steps";
import type { ValidationIssue } from "../services/validationApi";

export const getBotIntro = (): string =>
  "Hola, soy tu asistente Allianz para el prerregistro de reembolso. Te acompañaré paso a paso para validar tu documentación.";

export const getBotPromptForStep = (step: StepState): string => {
  const fields = step.requiredFields.join(", ");
  return `Paso ${step.title}.\n\n${step.validationHint}\n\nRequisitos mínimos que revisaremos: ${fields}. Puedes escribir comentarios adicionales y adjuntar el documento cuando estés listo.`;
};

export const getBotMessageOnValidationOk = (step: StepState): string => {
  return `Perfecto, el documento para "${step.title}" fue validado correctamente. Marcamos este paso como completo.`;
};

export const getBotMessageOnValidationFail = (step: StepState, issues: ValidationIssue[]): string => {
  if (!issues.length) {
    return `No pudimos validar el documento para "${step.title}". Por favor verifica que sea legible y corresponda a este paso, e inténtalo de nuevo.`;
  }

  const details = issues.map((i) => `• ${i.message}`).join("\n");
  return `Encontramos algunos problemas con el documento de "${step.title}":\n${details}\n\nPor favor corrige estos puntos y vuelve a subir el archivo.`;
};

