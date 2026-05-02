import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Coffee, Settings, CheckCircle2,
  LogOut, Search, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, AlertCircle, PackagePlus, Calendar, Moon, Sun,
} from 'lucide-react';
import orderContext from '../context/orders/orderContext';
import { TakeOrder } from './Orders';
import themeContext from '../context/theme/themeContext';

const Dashboard = () => {
  const { theme, toggleTheme } = useContext(themeContext);
  const { orders, markPaid, removeOrder, getOrder } = useContext(orderContext);
  const [ takeOrder, setTakeOrder ] = useState(false);
  const [ customer, setCustomer ] = useState(null);

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <CheckCircle2 className="text-green-400 w-5 h-5" />;
    if (status === 'fail') return <XCircle className="text-red-400 w-5 h-5" />;
    return <Clock className="text-amber-400 w-5 h-5" />;
  };

  useEffect(() => {
    setCustomer(prev => {
      const result = orders?.find(o => o._id === customer?.id);
      return result ? { id: result._id, status: result.status } : null;
    });
  }, [customer?.id, orders]);

  const countTotalSalesToday = () => {
    const onlyPaid = orders?.filter(o => o.status === "success");
    return onlyPaid?.reduce((total, item) => total + item.totalAmount, 0).toLocaleString();
  }

  return (
    <div className="flex h-screen w-full font-sans text-app-text bg-app-bg transition-colors duration-300">
      <AnimatePresence>
        {takeOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50"
          >
            <TakeOrder onClose={ () => setTakeOrder(false) }/>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col py-4 overflow-hidden">
        <div className="p-8 pt-2 overflow-y-auto custom-scrollbar">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Sales Today" value={`₱ ${countTotalSalesToday()}`} />
            <StatCard title="Pending Orders" value={orders?.filter(o => o.status === "pending").length} />
            <StatCard title="Top Seller" value="Kape-Ling Ka Ceramic Mug" />
            <StatCard title="Low Stock" value="3 items" alert />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ORDERS TABLE */}
            <div className="lg:col-span-2 bg-app-card rounded-3xl p-6 shadow-sm border border-app-border overflow-hidden transition-colors">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                Recent Orders
              </h2>
              <div className="overflow-x-auto h-100 custom-scrollbar-v2">
                <table className="w-full text-left border-separate border-spacing-y-1">
                  <thead>
                    <tr className="bg-app-bg text-app-text/60 text-[10px] uppercase font-black tracking-widest">
                      <th className="p-4 rounded-l-xl">No.</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 rounded-r-xl text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {orders?.map((order, idx) => (
                      <tr key={order._id} 
                        className={`transition-all duration-200 cursor-pointer group
                        ${customer?.id === order._id ? "bg-b1/20 border-l-4 border-b1"
                          : order.status === "success" ? "opacity-40 hover:opacity-40 bg-app-bg/30"
                          : "hover:bg-app-bg/50"
                        }
                        `}
                        onClick={() => setCustomer({ id: order._id, status: order.status })}>
                        <td className="p-4 font-bold text-sm text-app-text/40">{idx + 1}</td>
                        <td className="p-4">
                          <div className="font-bold text-sm">{order.customerName}</div>
                          <div className="text-[10px] opacity-50 uppercase font-medium">{order.address}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-md bg-app-bg border border-app-border text-[10px] font-black opacity-70">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-black text-b1">₱{order.totalAmount}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            <StatusIcon status={order.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <div className="bg-app-card rounded-3xl p-6 shadow-sm border border-app-border flex flex-col gap-4 transition-colors">
                <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
                <ActionButton label="Take Order" icon={<PlusCircle size={18}/>} func={() => setTakeOrder(true)} color="bg-b1 text-wh1 hover:bg-b2" />
                <ActionButton 
                   label={`${customer?.status !== "success" ? "Mark as Paid" : "Mark as Pending"}`} 
                   icon={<CheckCircle size={18}/>} 
                   func={() => markPaid(customer?.id, customer?.status !== "success" ? true : false)} 
                   color={`${customer?.status !== "success" ? "bg-green-600/20 !text-green-500 border border-green-500/50 hover:bg-green-600 hover:!text-white" : "bg-amber-500/20 !text-amber-500 border border-amber-500/50 hover:bg-amber-500 hover:!text-white"}`}
                   disabled={!customer}
                />
                <ActionButton label="Cancel Order" icon={<XCircle size={18}/>} color="bg-red-600/20 !text-red-500 border border-red-500/50 hover:bg-red-600 hover:!text-white" func={() => removeOrder(customer?.id)} 
                disabled={!customer || customer?.status === "success"} 
                />
                <ActionButton label="Refresh Orders" icon={<RefreshCw size={18}/>} color="bg-app-bg !text-app-text/60 border border-app-border hover:!text-app-text" func={() => getOrder()} />
              </div>

              {/* SETTINGS PREVIEW CARD */}
              <section className="bg-app-card p-6 rounded-xl shadow-sm border border-app-border transition-colors">
                <div className="flex items-center mb-4 gap-2 text-app-text opacity-90">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                  <h2 className="text-xl font-semibold">Appearance</h2>
                </div>
                
                <div className="flex gap-4">
                  {/* Light Mode Button */}
                  <button 
                    onClick={() => toggleTheme('light')}
                    className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-b1 bg-wh1/10' : 'border-app-border hover:border-g2'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 shadow-sm" />
                    <span className="text-sm font-medium">Light Mode</span>
                  </button>

                  {/* Dark Mode Button */}
                  <button 
                    onClick={() => toggleTheme('dark')}
                    className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-g1 bg-b1/20' : 'border-app-border hover:border-g2'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#1A1210] border-2 border-g2 shadow-sm" />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </button>
                </div>
              </section>
            </div>

          </div>
          <RecentlyAddedItems/>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, alert }) => (
  <div className={`bg-app-card p-6 rounded-2xl shadow-sm border-l-4 transition-all hover:-translate-y-0.5 ${alert ? 'border-red-500 shadow-red-500/5' : 'border-b1 shadow-b1/5'} border border-app-border`}>
    <p className="text-[10px] uppercase font-black text-app-text/40 mb-1 tracking-widest">{title}</p>
    <div className="flex items-center justify-between">
      <h3 className={`text-2xl font-black tracking-tighter ${alert ? 'text-red-500' : 'text-app-text'}`}>{value}</h3>
      {alert && <AlertCircle className="text-red-500 animate-pulse" size={20} />}
    </div>
  </div>
);

const ActionButton = ({ label, icon, func, color, disabled }) => (
  <button className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-black text-xs uppercase tracking-tight transition-all active:scale-95 shadow-lg shadow-black/5 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${color}`}
  onClick={func}
  disabled={disabled}>
    {icon} {label}
  </button>
);

const RecentlyAddedItems = () => {
  const recentItems = [
    { id: 1, name: 'Barako Brew 250g', price: '₱200', dateAdded: '2 days ago', category: 'Coffee' },
    { id: 2, name: 'Retro Pixel Poster', price: '₱129', dateAdded: '4 days ago', category: 'Merch' },
    { id: 3, name: 'Snack Combo Box', price: '₱179', dateAdded: '5 days ago', category: 'Food' },
    { id: 4, name: 'Coffee Grinder', price: '₱899', dateAdded: '1 week ago', category: 'Tools' },
  ];

  return (
    <div className="mt-8 bg-app-card rounded-3xl p-6 shadow-sm border border-app-border transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-app-text">
          <PackagePlus size={22} className="text-b1" />
          Recently Added Items
        </h2>
        <span className="text-[10px] font-black bg-app-bg px-3 py-1.5 rounded-full text-app-text/60 border border-app-border flex items-center gap-1 uppercase tracking-widest">
          <Calendar size={12} /> Last 7 Days
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentItems.map((item) => (
          <div key={item.id} className="bg-app-bg/50 border border-app-border p-5 rounded-2xl flex flex-col hover:bg-app-bg transition-all cursor-pointer group hover:shadow-xl hover:shadow-black/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase font-black text-app-text/30 tracking-widest">{item.category}</span>
              <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">NEW</span>
            </div>
            <h4 className="font-bold text-app-text group-hover:text-b1 transition-colors leading-tight">{item.name}</h4>
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-app-border/50">
              <span className="text-sm font-black text-b1">{item.price}</span>
              <span className="text-[10px] text-app-text/40 font-medium italic">{item.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;