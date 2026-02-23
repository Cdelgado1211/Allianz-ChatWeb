import type { ChatAction, ChatState } from "../types/chat";

export const initialChatState: ChatState = {
  steps: [],
  activeStepId: null,
  messages: [],
  uploads: {},
  conversationId: ""
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "INIT": {
      return {
        ...state,
        steps: action.payload.steps,
        activeStepId: action.payload.steps[0]?.id ?? null,
        messages: action.payload.introMessages,
        uploads: {},
        conversationId: action.payload.conversationId
      };
    }
    case "SEND_MESSAGE": {
      return {
        ...state,
        messages: [...state.messages, action.payload.message]
      };
    }
    case "ATTACH_FILE": {
      const upload = action.payload.upload;
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [upload.stepId]: upload
        }
      };
    }
    case "UPLOAD_STARTED": {
      const current = state.uploads[action.payload.stepId];
      if (!current) return state;
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.payload.stepId]: {
            ...current,
            status: "uploading",
            errorMessage: undefined
          }
        }
      };
    }
    case "UPLOAD_DONE": {
      const current = state.uploads[action.payload.stepId];
      if (!current) return state;
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.payload.stepId]: {
            ...current,
            status: "idle"
          }
        }
      };
    }
    case "VALIDATION_STARTED": {
      const current = state.uploads[action.payload.stepId];
      if (!current) return state;
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.payload.stepId]: {
            ...current,
            status: "validating",
            errorMessage: undefined
          }
        }
      };
    }
    case "VALIDATION_OK": {
      const current = state.uploads[action.payload.stepId];
      const updatedSteps = state.steps.map((s) =>
        s.id === action.payload.stepId ? { ...s, status: "done" } : s
      );
      return {
        ...state,
        steps: updatedSteps,
        uploads: {
          ...state.uploads,
          [action.payload.stepId]: current
            ? {
                ...current,
                status: "ok",
                confidence: action.payload.response.confidence,
                issues: action.payload.response.issues,
                extracted: action.payload.response.extracted
              }
            : current
        }
      };
    }
    case "VALIDATION_FAIL": {
      const current = state.uploads[action.payload.stepId];
      const updatedSteps = state.steps.map((s) =>
        s.id === action.payload.stepId ? { ...s, status: "error" } : s
      );
      return {
        ...state,
        steps: updatedSteps,
        uploads: {
          ...state.uploads,
          [action.payload.stepId]: current
            ? {
                ...current,
                status: "error",
                errorMessage: action.payload.errorMessage,
                issues: action.payload.issues
              }
            : current
        }
      };
    }
    case "NEXT_STEP": {
      const currentIndex = state.steps.findIndex((s) => s.id === state.activeStepId);
      if (currentIndex === -1) return state;

      const nextIndex = state.steps.findIndex((s, idx) => idx > currentIndex && s.status !== "done");

      const updatedSteps = state.steps.map((s, idx) => {
        if (idx === currentIndex && s.status === "done") {
          return s;
        }
        if (idx === nextIndex) {
          return { ...s, status: "active" };
        }
        return s;
      });

      return {
        ...state,
        steps: updatedSteps,
        activeStepId: nextIndex >= 0 ? state.steps[nextIndex].id : state.activeStepId
      };
    }
    case "RESET_STEP_FILE": {
      const uploads = { ...state.uploads };
      delete uploads[action.payload.stepId];
      return {
        ...state,
        uploads
      };
    }
    default:
      return state;
  }
};

