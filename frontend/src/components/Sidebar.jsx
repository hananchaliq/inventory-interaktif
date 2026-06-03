import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCubes, faLayerGroup, faChevronDown, faRightFromBracket, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export const menuNavigasi = [
   { name: "Dashboard", path: "/dashboard", icon: faChartLine, badge: "/" },
   { name: "Barang", path: "/barang", icon: faCubes, badge: "6" },
   { name: "Kategori", path: "/kategori", icon: faLayerGroup, badge: "4" },
];

export default function Sidebar({ isOpen, setIsOpen, onLogout }) {
   const [user, setUser] = useState(null);

   useEffect(() => {
      const userData = localStorage.getItem("user");

      if (userData) {
         setUser(JSON.parse(userData));
      }
   }, []);
   return (
      <>
         <aside
            className={`
            fixed inset-y-0 left-0 z-50 w-[230px]
            flex flex-col justify-between
            bg-[#111113] border-r border-[#222226]
            transform transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
         `}>
            {/* TOP */}
            <div>
               {/* LOGO */}
               <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[#222226] cursor-pointer hover:bg-[#18181b] transition-colors duration-100">
                  <div className="h-[7px] w-[7px] bg-amber-400 flex-shrink-0" />
                  <span className="text-[13px] font-medium text-[#f0f0f0] tracking-[0.06em] font-mono">TINKINV</span>
                  <span className="text-[10px] text-[#444] tracking-[0.06em] font-mono ml-auto">LIFE</span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-[#3a3a3a] ml-1" />
               </div>

               {/* SECTION LABEL */}
               <p className="text-[9px] text-[#3a3a3a] tracking-[0.12em] uppercase px-4 pt-3.5 pb-1.5 font-mono">Overview</p>

               {/* NAV */}
               <nav className="flex flex-col px-2 gap-px">
                  {menuNavigasi.map(menu => (
                     <NavLink
                        key={menu.path}
                        to={menu.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                           `flex items-center gap-2.5 px-2.5 py-2 text-[11px] font-mono
                            border transition-all duration-100 select-none tracking-[0.02em]
                            ${isActive ? "bg-[#1a1a1d] text-[#f0f0f0] border-[#252528] border-l-[1.5px] border-l-amber-400" : "text-[#555] border-transparent border-l-[1.5px] border-l-transparent hover:bg-[#18181b] hover:text-[#aaa] hover:border-[#252528] hover:border-l-[#333]"}`
                        }>
                        {({ isActive }) => (
                           <>
                              <FontAwesomeIcon icon={menu.icon} className="text-[13px] w-4 flex-shrink-0" />
                              <span className="flex-1">{menu.name}</span>
                              <span
                                 className={`text-[9px] px-1.5 py-px border font-mono
                                 ${isActive ? "bg-amber-400 text-[#111] border-amber-400" : "bg-[#1a1a1d] text-[#444] border-[#2a2a2e]"}`}>
                                 {menu.badge}
                              </span>
                           </>
                        )}
                     </NavLink>
                  ))}
               </nav>
            </div>

            {/* BOTTOM */}
            <div className="border-t border-[#1e1e21]">
               {/* USER */}
               <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1a1a1d] cursor-pointer hover:bg-[#18181b] transition-colors">
                  <div className="h-7 w-7 bg-[#1e1e21] border border-[#2a2a2e] flex items-center justify-center flex-shrink-0 text-[10px] font-medium text-[#777]">{user?.nama?.substring(0, 2).toUpperCase() || "AD"}</div>

                  <div>
                     <p className="text-[11px] text-[#ccc] font-mono">{user?.nama || "Administrator"}</p>

                     <p className="text-[9px] text-[#3a3a3a] font-mono mt-px">{user?.role || "Admin"}</p>
                  </div>

                  <FontAwesomeIcon icon={faEllipsisVertical} className="text-[13px] text-[#333] ml-auto" />
               </div>

               {/* LOGOUT */}
               <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-[9px]
                     text-[11px] font-mono text-[#444] tracking-[0.02em]
                     border-b border-[#1a1a1d]
                     hover:bg-[#1a0f0f] hover:text-red-400 transition-all duration-100">
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-[13px]" />
                  Logout
               </button>

               {/* STATUS */}
               <div className="flex items-center gap-2 px-4 py-2">
                  <span className="relative flex h-[5px] w-[5px]">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                     <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-green-500" />
                  </span>
                  <span className="text-[9px] text-[#333] uppercase tracking-[0.1em] font-mono">System Active</span>
               </div>
            </div>
         </aside>

         {/* MOBILE OVERLAY */}
         {isOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
      </>
   );
}
