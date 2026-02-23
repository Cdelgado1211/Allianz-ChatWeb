import type { StepConfig, StepState } from "../types/steps";

// Configura los mismos tipos de documentos que el portal actual,
// alineados con las categorías que la Lambda entiende.
export const STEP_CONFIG: StepConfig[] = [
  {
    id: "notice",
    title: "Aviso de accidente y/o enfermedad",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: [
      "Datos del asegurado (nombre, póliza, certificado)",
      "Datos del contratante / empresa (si aplica)",
      "Datos del accidente o enfermedad (fecha, hora, lugar, descripción)",
      "Datos del médico tratante y/o hospital",
      "Firmas visibles en el formato"
    ],
    validationHint:
      "Sube el FORMATO OFICIAL de aviso de accidente y/o enfermedad, requisitado con los datos del asegurado, del evento y firmado."
  },
  {
    id: "medical_report",
    title: "Informe médico / historia clínica",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: [
      "Nombre del paciente",
      "Diagnóstico",
      "Descripción clínica / evolución",
      "Tratamiento o indicaciones",
      "Datos del médico tratante"
    ],
    validationHint:
      "Sube un informe médico, historia clínica o nota médica donde se describan diagnóstico, evolución y tratamiento del padecimiento."
  },
  {
    id: "studies",
    title: "Interpretación de estudios",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: [
      "Datos del paciente",
      "Tipo de estudio realizado",
      "Resultados numéricos o descriptivos",
      "Conclusión o impresión diagnóstica"
    ],
    validationHint:
      "Sube la interpretación o resultados de estudios (laboratorio, gabinete, imagen, etc.), donde se vean claramente los valores y conclusiones."
  },
  {
    id: "fees_budget",
    title: "Presupuesto de honorarios",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: [
      "Datos del médico u hospital",
      "Conceptos de honorarios",
      "Montos estimados",
      "Fecha del presupuesto"
    ],
    validationHint:
      "Sube el presupuesto de honorarios médicos donde se especifiquen conceptos, montos estimados y datos del médico y/o hospital."
  },
  {
    id: "address_id",
    title: "Comprobante de domicilio + identificación / formato",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: [
      "Nombre del titular",
      "Domicilio completo",
      "Fecha reciente del comprobante",
      "Identificación oficial con fotografía",
      "Firma (si aplica)"
    ],
    validationHint:
      "Sube un comprobante de domicilio reciente y/o identificación oficial donde se vean claramente el nombre del titular, domicilio y, en su caso, la firma."
  },
  {
    id: "other",
    title: "Otros documentos de soporte",
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 10,
    requiredFields: ["Relación clara con el caso médico", "Datos que complementen la reclamación"],
    validationHint:
      "Sube cualquier otro documento que consideres relevante para tu reembolso (cartas, aclaraciones, soportes adicionales) siempre que esté relacionado con el caso. No subas aquí formatos de aviso, informes médicos, estudios, presupuestos ni comprobantes de domicilio/identificación, esos van en sus pasos específicos.",
    optional: true
  }
];

export const buildInitialStepsState = (): StepState[] =>
  STEP_CONFIG.map((step, index) => ({
    ...step,
    status: index === 0 ? "active" : "pending"
  }));
