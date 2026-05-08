import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AddApplication from "./pages/AddApplication";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Standalone pages (each has its own sidebar from Stitch design) */}
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />
        <Route path="add" element={<AddApplication />} />
      </Routes>
    </BrowserRouter>
  );
}
