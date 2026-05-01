import { useContext, useEffect, useState } from "react";
import Header from "../components/Header"
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, RefreshCcw, Plus, X } from 'lucide-react';
import productContext from "../context/products/productContext";
import orderContext from "../context/orders/orderContext";

const Orders = () => {
  const { orders, markPaid, removeOrder } = useContext(orderContext);
  const [ customer, setCustomer ] = useState(null);
  const [ takeOrder, setTakeOrder ] = useState(false);

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

  }, [orders]);

  return (
    <div>
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
      <div className="min-h-screen p-8 flex gap-8 font-sans rounded-3xl bg-g1">
        {/* SIDEBAR BUTTONS */}
        <div className="flex flex-col gap-3 w-56 shrink-0">
          <div className="mb-4 text-b1 font-bold text-xl px-2">Actions</div>
          
          {[
            { label: 'Take Order', color: 'bg-b2 text-wh1', func: () => setTakeOrder(true) },
            { label: `${customer?.status !== "success" ? "Mark as Paid" : "Mark as Pending"}`, color: `${customer?.status !== "success" ? "bg-green-600 text-white" : "bg-yellow-500 text-[#1c1c1c]"}`, 
            func: () => markPaid(customer?.id, customer?.status !== "success" ? true : false) },
            { label: 'Edit Order', color: 'bg-blue-500 text-white hover:bg-blue-600' },
            { label: 'Cancel Order', color: 'bg-red-600 text-white hover:bg-red-700', func: () =>  removeOrder(customer?.id)},
            { label: 'Refresh Orders', icon: <RefreshCcw />, color: 'border-2 border-[#47342E] text-[#47342E]' }
          ].map((btn, i) => (
            <button 
              key={i}
              className={`${btn.color} flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer`}
              onClick={btn.func}
            >
              {btn.label} {btn?.icon || ""}
            </button>
          ))}
        </div>

        {/* MAIN TABLE CONTAINER */}
        <div className="flex-1 h-[80vh] bg-g2 rounded-3xl shadow-2xl overflow-hidden border border-wh1/20">
          <div className="h-full flex flex-col text-wh1">

            {/* HEADER */}
            <div className="flex bg-b2 text-wh1 text-xs uppercase tracking-[0.15em] font-bold">
              <div className="w-[10%] py-5 text-center">No.</div>
              <div className="w-[30%] py-5 pl-4">Customer Name</div>
              <div className="w-[30%] py-5 pl-4">Address</div>
              <div className="w-[15%] py-5 text-center">Product</div>
              <div className="w-[15%] py-5 text-center">Method</div>
              <div className="w-[15%] py-5 text-center">Total</div>
              <div className="w-[15%] py-5 text-center">Status</div>
            </div>

            {/* BODY ORDER DATA */}
            <div className="overflow-y-auto flex-1 divide-y divide-wh1/10 custom-scrollbar">
              {orders?.map((order, idx) => (
                <button 
                  key={order._id} 
                  className={`flex w-full items-center text-center transition-colors group
                    ${customer?.id === order._id ? "bg-b2" : "hover:bg-b2/30"}`}
                  onClick={() => {
                    setCustomer({
                      id: order._id,
                      status: order.status
                    })
                  }}
                >
                  <div className="w-[10%] py-4 text-wh1/60 font-mono text-sm">{idx + 1}</div>

                  <div className="w-[30%] py-4">
                    <div className="flex items-center gap-4 pl-4">
                      <div className="relative">
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-g2 rounded-full"></div>
                      </div>
                        <div className="font-semibold text-sm text-wh1">{order.customerName}</div>
                    </div>
                  </div>

                  <div className="w-[30%] py-4">
                    <div className="text-start font-semibold text-sm text-wh1">{order.address}</div>
                  </div>

                  <div className="w-[15%] py-4 flex justify-center">
                    <div className="p-1 bg-wh1/10 rounded-lg">
                      <img src={order.img} className="w-14 h-10 object-cover rounded shadow-sm" />
                    </div>
                  </div>

                  <div className="w-[15%] py-4 text-sm font-medium">{order.paymentMethod.toUpperCase()}</div>
                  
                  <div className="w-[15%] py-4">
                    <span className="bg-b1 px-3 py-1 rounded-full text-xs font-semibold">
                      ₱ {order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-[15%] py-4 flex justify-center">
                    <div className="transform group-hover:scale-110 transition-transform">
                      <StatusIcon status={order.status} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TakeOrder = ({ onClose }) => {
  const { addOrder } = useContext(orderContext);
  const { allProducts, catProducts } = useContext(productContext);
  const [ category, setCategory ] = useState("All");
  const [ orderSum, setOrderSum ] = useState([]);

  // customer details for order
  const [ paymentMeth, setPaymenthMeth ] = useState("Cash");

  const addItem = (item) => {
    setOrderSum(prev => {
      const existing = prev.find(p => p._id === item._id);

      if (existing) {
        // update qty
        return prev.map(p =>
          p._id === item._id
            ? { ...p, quantity: p.quantity + 1, subtotal: p.price * (p.quantity + 1) }
            : p
        );
      }

      // add new item with qty = 1
      return [...prev, { ...item, quantity: 1, subtotal: item.price }];
    });
  }

  const removeItem = (id) => {
    const result = orderSum.filter(o => o._id !== id);
    setOrderSum(result);
  }

  return (
    <div className="min-h-screen w-full bg-wh1/25 backdrop-blur-lg text-b1 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-b2/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-g2/10 rounded-full blur-3xl" />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6 relative z-10">
        
        {/* =========================================================
           LEFT SIDE: Product Selection
           ========================================================= */}
        <div className="flex-1 flex flex-col bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl overflow-hidden">
          
          {/* Header & Categories */}
          <header className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full bg-b1/10 border border-b1/20 text-b1 text-sm font-medium hover:bg-b1 hover:text-wh1 transition-all cursor-pointer"
                onClick={() => onClose()}
                >
                  Close
                </button>
                <h1 className="text-3xl font-extrabold text-b1 tracking-tight">Take Order</h1>
              </div>
              {/* Search Bar */}
              <input 
                type="search" 
                placeholder="Search products..." 
                className="px-4 py-2 rounded-full bg-white/40 border border-b1/50 text-b1 placeholder:text-g2/70 focus:ring-2 focus:ring-b1/50 outline-none transition w-full max-w-xs"
              />
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {['All', 'Coffee', 'Food', 'Merch', 'Gifts', "Equipment"].map((cat, i) => (
                <button key={cat} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${category === cat ? 'bg-b1 text-wh1' : 'bg-white/40 hover:bg-b1/50 hover:text-wh1 text-b2 border border-white/20'} cursor-pointer`}
                onClick={() => setCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </header>

          {/* Product Grid - Scrollable area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {category === "All"
                ? (
                  <>
                    {allProducts?.map((product) => (
                      /* 2. PRODUCT CARD */
                      <div key={product._id} className="group bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-b1/30 transition-all duration-300 flex flex-col cursor-pointer">
                        {/* Image Placeholder */}
                        <div className="h-45 bg-g1/50 rounded-xl mb-4 flex items-center justify-center text-b1 font-bold group-hover:scale-105 transition-transform">
                          <img className="h-full w-full object-cover object-center" src={product.img} alt={product.name} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-b1 text-sm md:text-base leading-tight mb-1">{product.name}</h3>
                          <p className="text-g2 text-xs mb-3">{product.category}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                          <p className="font-bold text-b1">₱ {product.price.toFixed(2)}</p>
                          <button className="p-2 rounded-full bg-b1/80 text-wh1 hover:bg-b1 transition-colors scale-90 group-hover:scale-100 cursor-pointer"
                          onClick={() => addItem({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            img: product.img,
                          })}>
                            <span className="text-lg">
                              <Plus />
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )
                : (
                  <>
                    {catProducts?.[category]?.map((product) => (
                      /* 2. PRODUCT CARD */
                      <div key={product._id} className="group bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-b1/30 transition-all duration-300 flex flex-col cursor-pointer">
                        {/* Image Placeholder */}
                        <div className="h-45 bg-g1/50 rounded-xl mb-4 flex items-center justify-center text-b1 font-bold group-hover:scale-105 transition-transform">
                          <img className="h-full w-full object-cover object-center" src={product.img} alt={product.name} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-b1 text-sm md:text-base leading-tight mb-1">{product.name}</h3>
                          <p className="text-g2 text-xs mb-3">{product.category}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                          <p className="font-bold text-b1">₱ {product.price.toFixed(2)}</p>
                          <button className="p-2 rounded-full bg-b1/80 text-wh1 hover:bg-b1 transition-colors scale-90 group-hover:scale-100 cursor-pointer"
                          onClick={() => addItem({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            img: product.img
                          })}>
                            <span className="text-lg">
                              <Plus />
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
            </div>
          </div>
        </div>

        {/* =========================================================
           RIGHT SIDE: Order Summary
           ========================================================= */}
        <aside className="w-full lg:w-96 flex flex-col bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-b1">Current Order</h2>
            <button className="text-sm text-g2 hover:text-b1 cursor-pointer"
            onClick={() => setOrderSum([])}>
              Clear All
            </button>
          </div>
          
          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {orderSum?.length === 0
            && "No orders available at the moment."}
            {orderSum?.map(item => (
                <div key={item._id} className="flex gap-3 items-center p-3 bg-white/30 rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-g1/50 rounded-lg flex items-center justify-center text-b1 font-bold">
                      <img className="h-full w-full object-contain object-center" src={item.img} alt={item.name} />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-b1 text-sm">{item.name}</p>
                        <p className="text-xs text-b2">₱ {item.price + " × " + item.quantity}</p>
                    </div>
                    <p className="font-bold text-b1">₱ {item.price * item.quantity}</p>
                    <button className="text-xs text-g2 hover:text-red-500 p-1 cursor-pointer"
                    onClick={() =>removeItem(item._id)}>
                      <X />
                    </button>
                </div>
            ))}
          </div>

          {/* Checkout Section (Fixed at bottom of aside) */}
          <div className="mt-6 border-t border-white/50 pt-5 space-y-4">
            <div className="flex justify-between text-xl font-extrabold text-b1 pt-3">
              <span>Total</span>
              <span>
                ₱ {orderSum?.reduce((total, item) => {
                  return total + (item.price * item.quantity);
                }, 0)}
              </span>
            </div>
            <div className="relative w-full">
              <label className="text-xs font-semibold text-b1/70 mb-1 block uppercase tracking-wider ml-1">
                Payment Method
              </label>
              
              <select 
                className="w-full appearance-none px-4 py-3 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-b1 font-medium focus:ring-2 focus:ring-b1/50 outline-none transition-all cursor-pointer hover:bg-white/40"
                value={paymentMeth}
                onChange={(e) => setPaymenthMeth(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="GCash">G-Cash</option>
                <option value="Card">Card</option>
              </select>

              <div className="pointer-events-none absolute right-4 top-9.5 text-b1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <button className="w-full py-4 bg-b1 text-wh1 font-bold rounded-2xl hover:bg-b2 transition-all shadow-lg shadow-b1/20 active:scale-[0.98]
            cursor-pointer"
            onClick={() => addOrder(paymentMeth, orderSum)}>
              Add Order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Orders