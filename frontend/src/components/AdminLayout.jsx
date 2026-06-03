import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import NavbarMobile from "./NavbarMobile";
import Footer from "./Footer";

export default function AdminLayout() {
   const navigate = useNavigate();

   const [isOpen, setIsOpen] = useState(false);

   const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

   useEffect(() => {
      if (theme === "light") {
         document.documentElement.classList.remove("dark");
      } else {
         document.documentElement.classList.add("dark");
      }

      localStorage.setItem("theme", theme);
   }, [theme]);

   useEffect(() => {
      const user = localStorage.getItem("user");

      if (!user) {
         navigate("/");
      }
   }, [navigate]);

   const toggleTheme = () => {
      setTheme(prev => (prev === "dark" ? "light" : "dark"));
   };

   const handleLogout = () => {
      localStorage.removeItem("user");

      navigate("/");
   };

   return (
      <div className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-x-hidden ${theme === "dark" ? "bg-[#0c0c0e] text-zinc-200" : "bg-[#f4f5f6] text-zinc-800"}`}>
         <NavbarMobile isOpen={isOpen} setIsOpen={setIsOpen} theme={theme} toggleTheme={toggleTheme} />

         <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />

         <div className="flex-1 flex flex-col md:pl-64 pt-16 md:pt-0">
            <main className="flex-1 p-4 md:p-8">
               <Outlet />
            </main>

            <Footer />
         </div>
      </div>
   );
}
