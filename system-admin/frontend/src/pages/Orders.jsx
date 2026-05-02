import { useContext, useEffect, useState } from "react";
import Header from "../components/Header"
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CheckCircle, XCircle, PlusCircle, Clock, RefreshCcw, Plus, X, ShoppingBag, User } from 'lucide-react';
import productContext from "../context/products/productContext";
import orderContext from "../context/orders/orderContext";

export const Orders = () => {
  const { orders, markPaid, removeOrder, getOrder } = useContext(orderContext);
  const [ customer, setCustomer ] = useState(null);
  const [ takeOrder, setTakeOrder ] = useState(false);
  const [ viewItems, setViewItems ] = useState(null);

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
    <div className="bg-app-bg transition-colors duration-300 px-10">
      <ViewItems onClose={() => setViewItems(null)} items={viewItems} />
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
      
      <Header />
      
      <div className="min-h-screen py-8 flex flex-col lg:flex-row gap-8 font-sans bg-app-bg transition-colors">
        
        {/* SIDEBAR BUTTONS */}
        <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">
          <div className="mb-4 text-app-text font-bold text-xl px-2 opacity-90">Actions</div>
          <button className="bg-b2 text-wh1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          onClick={() => setTakeOrder(true)}>
            Take Order <PlusCircle size={18}/>
          </button>
          
          {[
            { label: `${customer?.status !== "success" ? "Mark as Paid" : "Mark as Pending"}`, icon: <CheckCircle size={18}/>, color: `${customer?.status !== "success" ? "bg-green-600 text-white" : "bg-yellow-500 text-[#1c1c1c]"}`, 
            func: () => markPaid(customer?.id, customer?.status !== "success" ? true : false) },
            { label: 'Cancel Order', icon: <XCircle size={18}/>, color: 'bg-red-600 text-white hover:bg-red-700', func: () =>  removeOrder(customer?.id)},
          ].map((btn, i) => (
            <button 
              key={i}
              className={`${btn.color} flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => customer && btn.func()}
              disabled={!customer || customer?.status === "success"}
            >
              {btn.label} {btn?.icon}
            </button>
          ))}
          
          <button className="border-2 border-app-border text-app-text flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-app-card shadow-sm cursor-pointer"
          onClick={() => getOrder()}>
            Refresh <RefreshCcw size={18}/>
          </button>
        </div>

        {/* MAIN TABLE CONTAINER */}
        <div className="flex-1 h-[75vh] bg-app-card rounded-3xl shadow-2xl overflow-hidden border border-app-border transition-colors">
          <div className="h-full flex flex-col">

            {/* HEADER - Hidden on mobile, visible on Large screens */}
            <div className="hidden lg:flex bg-b2 text-wh1 text-[10px] uppercase tracking-[0.2em] font-bold">
              <div className="w-[8%] py-5 text-center">No.</div>
              <div className="w-[27%] py-5 pl-4">Customer</div>
              <div className="w-[15%] py-5 pl-4">Address</div>
              <div className="w-[10%] py-5 text-center">Method</div>
              <div className="w-[15%] py-5 text-center">Items</div>
              <div className="w-[10%] py-5 text-center">Total</div>
              <div className="w-[15%] py-5 text-center">Status</div>
            </div>

            {/* BODY ORDER DATA */}
            <div className="overflow-y-auto flex-1 divide-y divide-app-border custom-scrollbar p-4 lg:p-0">
              {orders?.map((order, idx) => (
                <div 
                  key={order._id} 
                  className={`
                    w-full transition-all group cursor-pointer
                    ${order.status === "success" ? "hidden" : "flex"}
                    ${customer?.id === order._id ? "bg-b1/20 border-l-4 border-b1 lg:border-l-4" : "hover:bg-app-bg/50"}
                    flex-col lg:flex-row lg:items-center text-center mb-4 lg:mb-0 rounded-2xl lg:rounded-none border lg:border-none border-app-border lg:divide-none
                  `}
                  onClick={() => setCustomer({ id: order._id, status: order.status })}
                >
                  {/* DESKTOP INDEX / MOBILE HEADER */}
                  <div className="lg:w-[8%] py-2 lg:py-4 text-app-text opacity-40 font-mono text-xs flex justify-between px-4 lg:block">
                    <span className="lg:hidden font-bold uppercase tracking-widest text-[9px]">Order #{idx + 1}</span>
                    <span className="hidden lg:inline">{idx + 1}</span>
                  </div>

                  {/* CUSTOMER INFO */}
                  <div className="lg:w-[27%] py-3 lg:py-4 px-4 lg:px-0">
                    <div className="flex items-center gap-3 lg:pl-4 text-left">
                        <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-b1/20 flex items-center justify-center text-b1 shrink-0">
                            <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm lg:text-sm text-app-text">{order.customerName}</div>
                          {/* Visible only on mobile as subtitle */}
                          <div className="lg:hidden text-[10px] text-app-text opacity-50 truncate max-w-50">{order.address}</div>
                        </div>
                    </div>
                  </div>

                  {/* ADDRESS - Hidden on Mobile (integrated above) */}
                  <div className="hidden lg:block lg:w-[15%] py-4">
                    <div className="text-left font-medium text-xs text-app-text opacity-70 truncate pr-4">{order.address}</div>
                  </div>

                  {/* PAYMENT & ITEMS ROW - Side by side on mobile */}
                  <div className="flex items-center justify-between px-4 py-3 lg:hidden border-t border-app-border/50">
                    <div className="text-left">
                      <p className="text-[9px] uppercase tracking-tighter opacity-40">Method</p>
                      <p className="text-[11px] font-bold text-app-text">{order.paymentMethod}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewItems(order?.items); }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-app-bg border border-app-border rounded-xl text-app-text"
                    >
                      <span className="text-[10px] font-bold bg-b1 text-wh1 w-5 h-5 flex items-center justify-center rounded-full">
                        {order?.items.length || 0}
                      </span>
                      <span className="text-[10px] font-black uppercase">Items</span>
                    </button>
                  </div>

                  {/* DESKTOP PAYMENT METHOD */}
                  <div className="hidden lg:block lg:w-[10%] py-4">
                    <div className="text-center font-medium text-xs text-app-text opacity-70 truncate pr-4">{order.paymentMethod}</div>
                  </div>

                  {/* DESKTOP VIEW ITEMS */}
                  <div className="hidden lg:flex lg:w-[15%] py-4 justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewItems(order?.items); }}
                      className="group relative flex items-center gap-2 px-3 py-1 bg-app-bg border border-app-border hover:border-b1 rounded-full transition-all text-app-text cursor-pointer"
                    >
                      <span className="text-[10px] font-bold bg-b1 text-wh1 w-5 h-5 flex items-center justify-center rounded-full">
                        {order?.items.length || 0}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">View</span>
                    </button>
                  </div>
                  
                  {/* TOTAL & STATUS ROW */}
                  <div className="flex items-center justify-between lg:justify-center px-4 py-3 lg:py-4 lg:w-[10%] border-t lg:border-none border-app-border/50 bg-app-bg/20 lg:bg-transparent rounded-b-2xl lg:rounded-none">
                    <div className="lg:hidden text-[9px] uppercase tracking-widest opacity-40">Total</div>
                    <span className="text-app-text font-black text-sm lg:text-sm">
                      ₱{order.totalAmount?.toLocaleString()}
                    </span>
                    <div className="lg:w-full lg:hidden">
                      <StatusIcon status={order.status} />
                    </div>
                  </div>

                  {/* DESKTOP STATUS */}
                  <div className="hidden lg:flex lg:w-[15%] py-4 justify-center">
                    <StatusIcon status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ViewItems = ({ onClose, items }) => {
  if (!items) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-app-card w-full max-w-md max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-app-border transition-colors">
        <div className="p-5 border-b border-app-border flex justify-between items-center bg-app-bg/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-b1" size={20} />
            <h3 className="font-bold text-app-text">Order Items ({items?.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-app-bg rounded-full transition-colors text-app-text opacity-50 hover:opacity-100 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
            {items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-app-bg/30 border border-app-border">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0">
                    <img src={item?.img} alt={item?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-app-text truncate text-sm uppercase">{item?.name}</h4>
                    <p className="text-xs text-app-text opacity-50">Qty: <span className="font-bold text-b1">{item?.quantity || 1}</span></p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-app-text text-sm">₱{item?.subtotal?.toLocaleString()}</p>
                </div>
                </div>
            ))}
        </div>

        <div className="p-5 border-t border-app-border bg-app-bg/50 flex justify-between items-center">
          <span className="text-app-text opacity-50 text-sm font-medium">Total Amount</span>
          <span className="text-xl font-black text-b1">
            ₱{items?.reduce((total, item) => total + (item.subtotal * (item.quantity || 1)), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TakeOrder = ({ onClose }) => {
  const { addOrder } = useContext(orderContext);
  const { allProducts, catProducts } = useContext(productContext);
  const [ category, setCategory ] = useState("All");
  const [ orderSum, setOrderSum ] = useState([]);
  const [ paymentMeth, setPaymenthMeth ] = useState("Cash");

  const addItem = (item) => {
    setOrderSum(prev => {
      const existing = prev.find(p => p._id === item._id);
      if (existing) {
        return prev.map(p => p._id === item._id ? { ...p, quantity: p.quantity + 1, subtotal: p.price * (p.quantity + 1) } : p);
      }
      return [...prev, { ...item, quantity: 1, subtotal: item.price }];
    });
  }

  const removeItem = (id) => setOrderSum(orderSum.filter(o => o._id !== id));

  return (
    <div className="h-full w-full bg-app-bg/95 backdrop-blur-[2px] text-app-text p-4 md:p-8 relative overflow-hidden transition-colors">
      
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-b1/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-b2/20 rounded-full blur-3xl" />

      <div className="flex flex-col lg:flex-row h-full gap-6 relative z-10">
        
        {/* LEFT: Products */}
        <div className="flex-1 flex flex-col bg-app-card border border-app-border rounded-[2.5rem] p-6 shadow-xl overflow-hidden transition-colors">
          <header className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 rounded-full bg-app-bg hover:bg-b1 hover:text-wh1 transition-all border border-app-border cursor-pointer"><X size={20}/></button>
                <h1 className="text-3xl font-black text-app-text tracking-tight">Take Order</h1>
              </div>
              <input 
                type="search" 
                placeholder="Search menu..." 
                className="px-5 py-2.5 rounded-full bg-app-bg border border-app-border text-app-text placeholder:opacity-30 focus:ring-2 focus:ring-b1 outline-none w-full md:max-w-xs transition-all"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {['All', 'Coffee', 'Food', 'Merch', 'Gifts'].map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${category === cat ? 'bg-b1 text-wh1 shadow-lg shadow-b1/20' : 'bg-app-bg text-app-text opacity-60 hover:opacity-100 border border-app-border'}`}>
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {(category === "All" ? allProducts : catProducts?.[category])?.map((product) => (
                    <div key={product._id} className="group bg-app-bg border border-app-border rounded-3xl p-3 hover:border-b1 transition-all flex flex-col shadow-sm">
                        <div className="aspect-square bg-white rounded-2xl mb-3 overflow-hidden">
                            <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.img} alt={product.name} />
                        </div>
                        <h3 className="font-bold text-app-text text-sm mb-1 truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mt-auto">
                            <p className="font-black text-b1 text-sm">₱{product.price}</p>
                            <button onClick={() => addItem(product)} className="p-2 rounded-xl bg-b1 text-wh1 hover:bg-b2 transition-colors cursor-pointer"><Plus size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="w-full lg:w-100 flex flex-col bg-app-card border border-app-border rounded-[2.5rem] p-6 shadow-2xl transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-app-text">Cart Summary</h2>
            <button onClick={() => setOrderSum([])} className="text-xs font-bold text-red-400 hover:underline cursor-pointer">CLEAR ALL</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {orderSum.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <ShoppingBag size={48} />
                    <p className="text-sm font-bold mt-2">Empty Cart</p>
                </div>
            ) : (
                orderSum.map(item => (
                    <div key={item._id} className="flex gap-3 items-center p-3 bg-app-bg rounded-2xl border border-app-border group">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0"><img className="w-full h-full object-cover" src={item.img} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-app-text text-xs truncate">{item.name}</p>
                            <p className="text-[10px] text-app-text opacity-50">₱{item.price} x {item.quantity}</p>
                        </div>
                        <p className="font-bold text-b1 text-sm">₱{item.subtotal}</p>
                        <button onClick={() => removeItem(item._id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X size={14}/></button>
                    </div>
                ))
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-app-border space-y-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-app-text opacity-50">SUBTOTAL</span>
              <span className="text-2xl font-black text-b1">₱{orderSum.reduce((t, i) => t + i.subtotal, 0).toLocaleString()}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-app-text opacity-40 ml-1">PAYMENT METHOD</label>
              <select 
                className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-app-text font-bold text-sm focus:ring-2 focus:ring-b1 outline-none transition-all cursor-pointer"
                value={paymentMeth}
                onChange={(e) => setPaymenthMeth(e.target.value)}
              >
                <option value="Cash" className="bg-app-card">💵 Cash</option>
                <option value="GCash" className="bg-app-card">📱 GCash</option>
                <option value="Card" className="bg-app-card">💳 Card</option>
              </select>
            </div>

            <button 
                onClick={async () => { await addOrder(paymentMeth, orderSum); setOrderSum([]); onClose(); }}
                disabled={orderSum.length === 0}
                className="w-full py-4 bg-b1 text-wh1 font-black rounded-2xl hover:bg-b2 transition-all shadow-lg shadow-b1/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              COMPLETE ORDER
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};