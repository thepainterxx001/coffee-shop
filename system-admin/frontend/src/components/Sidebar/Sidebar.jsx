import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, User,
  Coffee, 
  ClipboardList, 
  BarChart3, 
  Calendar, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { axiosAdmin } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { useContext } from "react";
import authContext from "../../context/auth/authContext";

const Sidebar = () => {
  const { checkAuth, admin } = useContext(authContext);
  const navigate = useNavigate()
  const location = useLocation();
  const [ activePath, setActivePath ] = useState(location.pathname);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path:"/dashboard" },
    { name: 'Products', icon: <Coffee size={20} />, path:"/products" },
    { name: 'Orders', icon: <ClipboardList size={20} />, path:"/orders" },
    { name: 'Settings', icon: <Settings size={20} />, path:"/settings" },
  ];

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location])

  return (
    <div className="flex h-screen w-full bg-app-bg overflow-hidden transition-colors duration-300">
      
      <aside className="min-w-62 bg-b2 rounded-r-[40px] flex flex-col text-white overflow-hidden select-none shadow-xl">
        
        <div className="flex flex-col items-center py-8 bg-b1 shadow-md">
          <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden mb-3 bg-app-bg/10 flex items-center justify-center">
             <User size={40} className="text-white/50" />
          </div>
          <h3 className="text-lg font-medium tracking-wide">{admin?.name}</h3>
        </div>

        {/* Links section */}
        <nav className="flex-1 mt-6 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          {menuItems.map((link) => (
            <div key={link.name} className="relative group">
              <div 
                className={`
                  flex items-center gap-4 px-8 py-3 ml-4 rounded-l-xl transition-all duration-200 cursor-pointer
                  ${activePath === link.path 
                    ? 'bg-app-bg text-app-text font-bold shadow-[-4px_0_10px_rgba(0,0,0,0.1)]' 
                    : 'text-g1 hover:bg-white/5 hover:text-white'}
                `}
                onClick={() => navigate(link.path)}
              >
                <span className={`${activePath === link.path ? 'text-app-text' : 'text-g1 group-hover:text-white'}`}>
                  {link.icon}
                </span>
                <span className="text-sm tracking-medium">{link.name}</span>
              </div>

            </div>
          ))}
        </nav>

        {/* Logout section */}
        <div className="p-8 border-t border-white/5">
          <button 
            className="flex items-center gap-4 text-g1 hover:text-red-300 transition-colors w-full cursor-pointer group"
            onClick={async () => {
              const res = await axiosAdmin.post("/logout-admin");
              await checkAuth({ showLoading: false });
              toast.success(res.data.message);
            }}
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* Pinalitan ang Outlet container para maging responsive at scrollable */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full custom-scrollbar-v2 overflow-y-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar