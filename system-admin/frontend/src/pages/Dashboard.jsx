import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Coffee, Settings, CheckCircle2,
  LogOut, Search, RefreshCw, CheckCircle, XCircle, Clock, PlusCircle, AlertCircle, PackagePlus, Calendar
} from 'lucide-react';
import orderContext from '../context/orders/orderContext';
import { TakeOrder } from './Orders';
import { useEffect } from 'react';

const Dashboard = () => {
  const { orders } = useContext(orderContext);
  const [ takeOrder, setTakeOrder ] = useState(false);
  const [ customer, setCustomer ] = useState(null);

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <CheckCircle2 className="text-green-400 w-5 h-5" />;
    if (status === 'fail') return <XCircle className="text-red-300 w-5 h-5" />;
    return <Clock className="text-orange-300 w-5 h-5" />;
  };

  useEffect(() => {
    setCustomer(prev => {
      const result = orders?.find(o => o._id === customer?.id);
      return result ? { id: result._id, status: result.status } : null;
    });

  }, [customer?.id, orders]);

  return (
    <div className="flex h-screen w-full font-sans text-stone-800">
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
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-20 bg-transparent flex items-center justify-between px-8">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#E3D5CA] border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-[#D5BDAF] outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-stone-500" size={18} />
          </div>
          
        </header>

        {/* DASHBOARD GRID */}
        <div className="p-8 pt-2 overflow-y-auto">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Sales Today" value="₱14,500" />
            <StatCard title="Pending Orders" value="5" />
            <StatCard title="Top Seller" value="Kape-Ling Ka Ceramic Mug" />
            <StatCard title="Low Stock" value="3 items" alert />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ORDERS TABLE */}
            <div className="lg:col-span-2 bg-[#E3D5CA] rounded-3xl p-6 shadow-sm overflow-hidden">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#584D3D] text-[#F5EBE0] text-xs uppercase tracking-wider">
                      <th className="p-4 rounded-tl-xl">No.</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 rounded-tr-xl text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-stone-50/50">
                    {orders?.map((order, idx) => (
                      <tr key={order._id} className={`border-b border-[#D5BDAF] transition-colors
                        ${customer?.id === order._id ? "bg-green-500/50"
                          : order.status === "success" ? "bg-green-500/30 opacity-75"
                          : "hover:bg-white/40"
                        }
                        `}
                        onClick={() => setCustomer({
                          id: order._id,
                          status: order.status
                        })}>
                        <td className="p-4 font-medium">{idx + 1}</td>
                        <td className="p-4">
                          <div className="font-semibold">{order.customerName}</div>
                          <div className="text-xs text-stone-500">{order.address}</div>
                        </td>
                        <td className="p-4 font-bold text-xs uppercase">{order.paymentMethod}</td>
                        <td className="p-4 font-bold">₱ {order.totalAmount}</td>
                        <td className="p-4 text-center">
                          <span className="inline-block">
                            <StatusIcon status={order.status} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#E3D5CA] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
                <ActionButton label="Take Order" icon={<PlusCircle size={18}/>} func={() => setTakeOrder(true)} color="bg-[#584D3D]" />
                <ActionButton label="Mark as Paid" icon={<CheckCircle size={18}/>} color="bg-green-600" />
                <ActionButton label="Cancel Order" icon={<XCircle size={18}/>} color="bg-red-600" />
                <ActionButton label="Refresh Orders" icon={<RefreshCw size={18}/>} color="border-2 border-[#584D3D] !text-[#584D3D] !bg-transparent" />
              </div>

              {/* SETTINGS PREVIEW CARD */}
              <div className="bg-[#E3D5CA]/50 border-2 border-dashed border-[#D5BDAF] rounded-3xl p-6 flex flex-col items-center justify-center text-center opacity-70">
                <Settings size={32} className="mb-2 text-stone-400" />
                <p className="text-sm font-medium">Configure your shop settings in the sidebar</p>
              </div>
            </div>

          </div>
          <RecentlyAddedItems/>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, alert }) => (
  <div className={`bg-[#E3D5CA] p-5 rounded-2xl shadow-sm border-b-4 ${alert ? 'border-red-500' : 'border-[#D5BDAF]'}`}>
    <p className="text-xs uppercase font-bold text-stone-500 mb-1">{title}</p>
    <div className="flex items-center justify-between">
      <h3 className={`text-2xl font-black ${alert ? 'text-red-600' : 'text-stone-800'}`}>{value}</h3>
      {alert && <AlertCircle className="text-red-500" size={20} />}
    </div>
  </div>
);

const ActionButton = ({ label, icon, func, color }) => (
  <button className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl text-white font-bold transition-transform active:scale-95 shadow-sm cursor-pointer ${color}`}
  onClick={func}>
    {icon} {label}
  </button>
);

const RecentlyAddedItems = () => {
  // Halimbawa ng data para sa mga bagong item
  const recentItems = [
    { id: 1, name: 'Barako Brew 250g', price: '₱200', dateAdded: '2 days ago', category: 'Coffee' },
    { id: 2, name: 'Retro Pixel Poster', price: '₱129', dateAdded: '4 days ago', category: 'Merch' },
    { id: 3, name: 'Snack Combo Box', price: '₱179', dateAdded: '5 days ago', category: 'Food' },
    { id: 4, name: 'Coffee Grinder', price: '₱899', dateAdded: '1 week ago', category: 'Tools' },
  ];

  return (
    <div className="mt-8 bg-[#E3D5CA] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-stone-800">
          <PackagePlus size={22} className="text-[#584D3D]" />
          Recently Added Items (Past 7 Days)
        </h2>
        <span className="text-xs font-semibold bg-[#D5BDAF] px-3 py-1 rounded-full text-stone-700 flex items-center gap-1">
          <Calendar size={12} /> Last 7 Days
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentItems.map((item) => (
          <div key={item.id} className="bg-white/50 border border-[#D5BDAF] p-4 rounded-2xl flex flex-col hover:bg-white transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold text-stone-400">{item.category}</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">NEW</span>
            </div>
            <h4 className="font-bold text-stone-800 group-hover:text-[#584D3D]">{item.name}</h4>
            <div className="mt-auto pt-3 flex justify-between items-center border-t border-[#D5BDAF]/30">
              <span className="text-sm font-black text-stone-700">{item.price}</span>
              <span className="text-[10px] text-stone-500 italic">{item.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;