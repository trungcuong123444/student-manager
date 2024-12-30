import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ParentPage from "./pages/profile/Profile";
import firebase from "../src/context/Firebase/firebase.config";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    console.log(firebase);
    
  })
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
