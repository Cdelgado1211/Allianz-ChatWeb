import { Route, Routes, Navigate } from "react-router-dom";
import { ChatFlowPage } from "./pages/ChatFlowPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ClaimConfirmationPage } from "./pages/ClaimConfirmationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatFlowPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/claim-confirmation" element={<ClaimConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
