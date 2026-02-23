import { FormEvent, useRef, useState } from "react";
import { useChat } from "../state/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { FileCard } from "./FileCard";

export const ChatWindow = () => {
  const { messages, uploads, activeStep, activeStepId, sendUserMessage, sendUserMessageWithFile } =
    useChat();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFileError(null);

    if (!text.trim() && !file) {
      return;
    }

    if (file) {
      if (!activeStep || !activeStepId) {
        setFileError("No hay un paso activo para adjuntar el documento.");
        return;
      }

      if (!activeStep.acceptedMimeTypes.includes(file.type)) {
        setFileError("El tipo de archivo no es válido para este paso.");
        return;
      }

      const maxSizeMB = activeStep.maxSizeMB;
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setFileError(`El archivo supera el tamaño máximo permitido (${maxSizeMB} MB).`);
        return;
      }

      await sendUserMessageWithFile(text || null, file);
    } else if (text.trim()) {
      sendUserMessage(text);
    }

    setText("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const activeUpload = activeStepId ? uploads[activeStepId] : undefined;

  return (
    <section
      aria-label="Conversación de chat para prerregistro de reembolso"
      className="flex h-full flex-1 flex-col bg-surface"
    >
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {activeUpload && <FileCard upload={activeUpload} />}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-surface px-4 py-3 sm:px-6"
      >
        {activeStep && (
          <p className="mb-2 text-xs text-slate-600">
            Paso actual: <span className="font-medium">{activeStep.title}</span>
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="user-message" className="sr-only">
              Escribe tu mensaje
            </label>
            <textarea
              id="user-message"
              rows={2}
              className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="Escribe un mensaje para el asistente…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Adjuntar documento para validación"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Adjuntar
              </button>
              {file && (
                <span className="truncate text-xs text-slate-600" aria-live="polite">
                  {file.name}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Enviar
            </button>
          </div>
        </div>
        {fileError && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {fileError}
          </p>
        )}
      </form>
    </section>
  );
};

