export type StepStatus = "pending" | "active" | "done" | "error";

export interface StepConfig {
  id: string;
  title: string;
  acceptedMimeTypes: string[];
  maxSizeMB: number;
  requiredFields: string[];
  validationHint: string;
  optional?: boolean;
}

export interface StepState extends StepConfig {
  status: StepStatus;
}

