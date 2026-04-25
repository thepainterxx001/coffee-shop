import { useState } from "react";
import Header from "../components/Header"
import { CheckCircle2, XCircle, Clock, RefreshCcw } from 'lucide-react';

const Orders = () => {
  const [ selectCustomer, setSelectCustomer ] = useState(null);

  const orders = [
    { id: '#1', name: 'Emma Johnson', payment: 'Cash', total: 150, status: 'success' },
    { id: '#2', name: 'Evan Coleman', payment: 'Cash', total: 150, status: 'fail' },
    { id: '#3', name: 'Emma Miller', payment: 'Card', total: 150, status: 'success' },
    { id: '#4', name: 'Noah Turner', payment: 'Cash', total: 150, status: 'fail' },
    { id: '#5', name: 'Emma Johnson', payment: 'Card', total: 150, status: 'success' },
    { id: '#6', name: 'Evan Coleman', payment: 'Cash', total: 150, status: 'waiting' },
    { id: '#7', name: 'Emma Miller', payment: 'Cash', total: 150, status: 'success' },
  ];

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <CheckCircle2 className="text-green-400 w-5 h-5" />;
    if (status === 'fail') return <XCircle className="text-red-300 w-5 h-5" />;
    return <Clock className="text-orange-300 w-5 h-5" />;
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen p-8 flex gap-8 font-sans rounded-3xl bg-g1">
        {/* SIDEBAR BUTTONS */}
        <div className="flex flex-col gap-3 w-56 shrink-0">
          <div className="mb-4 text-b1 font-bold text-xl px-2">Actions</div>
          
          {[
            { label: 'Take Order', color: 'bg-[#47342E] text-wh1' },
            { label: 'Mark as Paid', color: 'bg-b2 text-wh1' },
            { label: 'Edit Order', color: 'bg-g2 text-wh1' },
            { label: 'Cancel Order', color: 'bg-[#A69993] text-[#47342E]' },
            { label: 'Refresh Orders', icon: <RefreshCcw />, color: 'border-2 border-[#47342E] text-[#47342E]' }
          ].map((btn, i) => (
            <button 
              key={i}
              className={`${btn.color} flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer`}
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
              <div className="w-[15%] py-5 text-center">Product</div>
              <div className="w-[15%] py-5 text-center">Method</div>
              <div className="w-[15%] py-5 text-center">Total</div>
              <div className="w-[15%] py-5 text-center">Status</div>
            </div>

            {/* BODY ORDER DATA */}
            <div className="overflow-y-auto flex-1 divide-y divide-wh1/10 custom-scrollbar">
              {orders.map((order, idx) => (
                <button 
                  key={idx} 
                  className={`flex w-full items-center text-center hover:bg-b2/30 transition-colors group
                    ${selectCustomer === order.id ? "bg-b1" : ""}`}
                  onClick={() => {
                    setSelectCustomer(order.id)
                  }}
                >
                  <div className="w-[10%] py-4 text-wh1/60 font-mono text-sm">{order.id}</div>

                  <div className="w-[30%] py-4">
                    <div className="flex items-center gap-4 pl-4">
                      <div className="relative">
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-g2 rounded-full"></div>
                      </div>
                        <div className="font-semibold text-sm text-wh1">{order.name}</div>
                    </div>
                  </div>

                  <div className="w-[15%] py-4 flex justify-center">
                    <div className="p-1 bg-wh1/10 rounded-lg">
                      <img src={order.img} className="w-14 h-10 object-cover rounded shadow-sm" />
                    </div>
                  </div>

                  <div className="w-[15%] py-4 text-sm font-medium">{order.payment}</div>
                  
                  <div className="w-[15%] py-4">
                    <span className="bg-b1 px-3 py-1 rounded-full text-xs font-semibold">
                      ₱{order.total}
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

export default Orders