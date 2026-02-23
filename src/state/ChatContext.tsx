import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ChatContextValue, ChatMessage } from "../types/chat";
import { chatReducer, initialChatState } from "./chatReducer";
import { buildInitialStepsState } from "../lib/stepsConfig";
import { getBotIntro, getBotMessageOnValidationFail, getBotMessageOnValidationOk, getBotPromptForStep } from "../lib/bot";
import { getOrCreateConversationId, clearConversationId } from "../lib/storage";
import { validateDocument } from "../services/validationApi";

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const createMessage = (sender: "bot" | "user", text: string, stepId?: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  sender,
  text,
  createdAt: new Date().toISOString(),
  stepId
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  useEffect(() => {
    const steps = buildInitialStepsState();
    const conversationId = getOrCreateConversationId();
    const firstStep = steps[0];

    const introMessages: ChatMessage[] = [];
    introMessages.push(createMessage("bot", getBotIntro()));
    if (firstStep) {
      introMessages.push(createMessage("bot", getBotPromptForStep(firstStep), firstStep.id));
    }

    dispatch({
      type: "INIT",
      payload: { steps, conversationId, introMessages }
    });
  }, []);

  const activeStep = useMemo(
    () => state.steps.find((s) => s.id === state.activeStepId),
    [state.steps, state.activeStepId]
  );

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const msg = createMessage("user", text, state.activeStepId ?? undefined);
    dispatch({ type: "SEND_MESSAGE", payload: { message: msg } });
  };

  const sendUserMessageWithFile = async (text: string | null, file: File) => {
    if (!activeStep || activeStep.id !== state.activeStepId) {
      const warning = createMessage(
        "bot",
        "Solo puedes adjuntar documentos para el paso actual. Revisa el panel de progreso.",
        state.activeStepId ?? undefined
      );
      dispatch({ type: "SEND_MESSAGE", payload: { message: warning } });
      return;
    }

    if (text && text.trim()) {
      sendUserMessage(text);
    }

    const upload = {
      stepId: activeStep.id,
      fileName: file.name,
      sizeBytes: file.size,
      mimeType: file.type,
      status: "idle" as const
    };

    dispatch({ type: "ATTACH_FILE", payload: { upload } });
    dispatch({ type: "UPLOAD_STARTED", payload: { stepId: activeStep.id } });
    dispatch({ type: "VALIDATION_STARTED", payload: { stepId: activeStep.id } });

    const validatingMsg = createMessage(
      "bot",
      "Estoy validando tu documento. Esto puede tardar unos segundos…",
      activeStep.id
    );
    dispatch({ type: "SEND_MESSAGE", payload: { message: validatingMsg } });

    try {
      const response = await validateDocument(
        activeStep.id,
        file,
        state.conversationId,
        text ?? undefined
      );

      if (response.ok) {
        dispatch({ type: "VALIDATION_OK", payload: { stepId: activeStep.id, response } });
        const okText = getBotMessageOnValidationOk(activeStep);
        dispatch({ type: "SEND_MESSAGE", payload: { message: createMessage("bot", okText, activeStep.id) } });

        const currentIndex = state.steps.findIndex((s) => s.id === activeStep.id);
        const nextStep = state.steps.find((_, idx) => idx > currentIndex);

        if (nextStep) {
          dispatch({ type: "NEXT_STEP" });
          const nextPrompt = getBotPromptForStep(nextStep);
          dispatch({
            type: "SEND_MESSAGE",
            payload: { message: createMessage("bot", nextPrompt, nextStep.id) }
          });
        }
      } else {
        dispatch({
          type: "VALIDATION_FAIL",
          payload: {
            stepId: activeStep.id,
            issues: response.issues
          }
        });
        const failText = getBotMessageOnValidationFail(activeStep, response.issues);
        dispatch({
          type: "SEND_MESSAGE",
          payload: { message: createMessage("bot", failText, activeStep.id) }
        });
      }
    } catch (error) {
      dispatch({
        type: "VALIDATION_FAIL",
        payload: {
          stepId: activeStep.id,
          issues: [],
          errorMessage:
            error instanceof Error
              ? error.message
              : "Ocurrió un error al validar el documento. Inténtalo de nuevo."
        }
      });
      const friendly = createMessage(
        "bot",
        "Tuvimos un problema al validar tu documento (posible error de red o tiempo de espera). Por favor inténtalo nuevamente.",
        activeStep.id
      );
      dispatch({ type: "SEND_MESSAGE", payload: { message: friendly } });
    }
  };

  const resetFlow = () => {
    clearConversationId();
    window.location.reload();
  };

  const value: ChatContextValue = {
    ...state,
    sendUserMessage,
    sendUserMessageWithFile,
    resetFlow,
    activeStep
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat debe usarse dentro de ChatProvider");
  }
  return ctx;
};

