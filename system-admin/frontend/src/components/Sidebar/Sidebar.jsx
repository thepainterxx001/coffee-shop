import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Coffee, 
  ClipboardList, 
  Truck, 
  Users, 
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
  const { checkAuth } = useContext(authContext);
  const navigate = useNavigate()
  const location = useLocation();
  const [ activePath, setActivePath ] = useState(location.pathname);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path:"/dashboard" },
    { name: 'Products', icon: <Coffee size={20} />, path:"/products" },
    { name: 'Orders', icon: <ClipboardList size={20} />, path:"/orders" },
    { name: 'Delivery', icon: <Truck size={20} />, path:"/delivery" },
    { name: 'Staff', icon: <Users size={20} />, path:"/staff" },
    { name: 'Statistics', icon: <BarChart3 size={20} />, path:"/statistics" },
    { name: 'Calendar', icon: <Calendar size={20} />, path:"/calendar" },
    { name: 'Settings', icon: <Settings size={20} />, path:"/settings" },
  ];

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location])

  return (
    <div className="flex h-screen w-full bg-wh1 overflow-hidden">
      
      {/* sidebar container */}
      <aside className="min-w-62 bg-b2 rounded-r-[40px] flex flex-col text-white overflow-hidden select-none">
        
        {/* profile section */}
        <div className="flex flex-col items-center py-8 bg-b1">
          <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden mb-3">
            {/* picture will azdd here */}
          </div>
          <h3 className="text-lg font-medium">Admin System</h3>
        </div>

        {/* links all here */}
        <nav className="flex-1 mt-6 flex flex-col gap-1">
          {menuItems.map((link, i) => (
            <div key={link.name} className="relative group">
              <div className={`
                flex items-center gap-4 px-8 py-3 ml-4 rounded-l-xl transition-colors cursor-pointer
                ${activePath === link.path 
                  ? 'bg-wh1 text-[#4a3731] font-semibold' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'}
              `}
              onClick={() => navigate(link.path) }>
                <span>{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </div>
            </div>
          ))}
        </nav>

        {/* logout section */}
        <div className="p-8">
          <button className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors w-full cursor-pointer"
          onClick={ async () => {
            const res = await axiosAdmin.post("/logout-admin");
            await checkAuth({ showLoading: false });
            toast.success(res.data.message);
          }}>
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* here will render all paths/pages using outlet */}
      <main className="flex-1 p-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar