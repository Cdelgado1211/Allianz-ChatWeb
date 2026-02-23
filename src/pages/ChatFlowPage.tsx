import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { StepSidebar } from "../components/StepSidebar";
import { ProgressMobile } from "../components/ProgressMobile";
import { ChatWindow } from "../components/ChatWindow";
import { useChat } from "../state/ChatContext";

export const ChatFlowPage = () => {
  const { steps, activeStepId } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const allDone = steps.length > 0 && steps.every((s) => s.status === "done");
    if (allDone) {
      navigate("/success");
    }
  }, [steps, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ProgressMobile steps={steps} activeStepId={activeStepId} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <StepSidebar steps={steps} activeStepId={activeStepId} />
        <ChatWindow />
      </main>
    </div>
  );
};

