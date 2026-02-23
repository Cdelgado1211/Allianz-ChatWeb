import type { UploadInfo } from "../types/chat";

interface Props {
  upload: UploadInfo;
}

export const FileCard: React.FC<Props> = ({ upload }) => {
  const { fileName, sizeBytes, mimeType, status, errorMessage } = upload;

  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);

  const statusLabel =
    status === "uploading"
      ? "Subiendo…"
      : status === "validating"
      ? "Validando documento…"
      : status === "ok"
      ? "Documento válido"
      : status === "error"
      ? "Error en validación"
      : "Adjuntado";

  const statusColor =
    status === "ok"
      ? "text-success"
      : status === "error"
      ? "text-danger"
      : status === "validating" || status === "uploading"
      ? "text-accent"
      : "text-slate-600";

  return (
    <div className="mt-3 rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="truncate">
          <p className="truncate font-medium text-slate-900">{fileName}</p>
          <p className="text-[11px] text-slate-500">
            {sizeMB} MB · {mimeType}
          </p>
        </div>
        <span className={statusColor}>{statusLabel}</span>
      </div>
      {errorMessage && (
        <p className="mt-1 text-[11px] text-danger">Detalle: {errorMessage}</p>
      )}
    </div>
  );
};

