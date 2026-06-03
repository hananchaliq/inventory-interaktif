import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/admin/Dashboard";
import Barang from "./pages/admin/Barang";
import Kategori from "./pages/admin/Kategori";

import AdminLayout from "./components/AdminLayout";

export default function App() {
   return (
      <Router>
         <Routes>
            {/* Login */}
            <Route path="/" element={<Login />} />

            {/* Admin */}
            <Route element={<AdminLayout />}>
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/barang" element={<Barang />} />
               <Route path="/kategori" element={<Kategori />} />
            </Route>
         </Routes>
      </Router>
   );
}
