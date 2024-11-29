import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ParentPage from "./pages/profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/user" replace />} />
      {/* <Route path="/summary/*" element={<ParentPage />} /> */}
    </Routes>
  );
}

export default App;
