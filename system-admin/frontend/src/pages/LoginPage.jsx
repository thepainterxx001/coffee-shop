import { useContext } from "react";
import { useState } from "react";
import authContext from "../context/auth/authContext";
import { useEffect } from "react";

const LoginPage = () => {
  const { loginAdmin } = useContext(authContext);
  const [ username, setUsername ] = useState(() => {
    return localStorage.getItem("username");
  }); 
  const [ password, setPassword ] = useState(""); 

  const loginReq = () => {
    localStorage.setItem("username", username);
    loginAdmin({username, password});
  } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-wh1 font-sans p-4 relative overflow-hidden">
      
      {/* Background Decorative Elements (Coffee Bean Style) */}
      <div className="absolute top-[-10%] right-[-5%] text-g1 opacity-20 rotate-12 pointer-events-none">
        <img src="/coffee-beans.svg" alt="" />
      </div>
      <div className="absolute bottom-[-10%] left-[-5%] text-g1 opacity-20 rotate-12 pointer-events-none">
        <img src="/coffee-beans.svg" alt="" />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-g1 rounded-[40px] shadow-2xl p-10 flex flex-col items-center relative z-10">
        
        {/* Title */}
        <h1 className="text-b2 text-4xl font-serif mb-8 italic">Coffee Shop</h1>

        <div className="w-full space-y-5">
          <div className="text-left w-full mb-2">
            <h2 className="text-b2 text-lg font-medium ml-2">Admin Login</h2>
          </div>

          {/* Username Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-g2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input 
              type="text" 
              value={username}
              placeholder="Username" 
              className="w-full py-4 pl-12 pr-4 bg-wh1 rounded-2xl border-none focus:ring-2 focus:ring-g2 text-b1 placeholder-g3 outline-none transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-g2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full py-4 pl-12 pr-4 bg-wh1 rounded-2xl border-none focus:ring-2 focus:ring-g2 text-b1 placeholder-g3 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value.trim())}
            />
          </div>

          {/* <div className="text-right">
            <button type="button" className="text-b2 text-sm hover:underline font-medium">
              Forgot Password?
            </button>
          </div> */}

          {/* Login Button */}
          <button 
            type="submit" 
            className="w-full bg-b1 text-[#text-wh1ounded-2xl font-bold text-lg hover:bg-b2 transition-colors shadow-lg mt-4 active:scale-95 duration-150 p-2 text-white cursor-pointer"
            onClick={loginReq}
          >
            Login
          </button>
        </div>

        <div className="absolute bottom-6 right-8 opacity-40">
           <span className="text-2xl">🍪</span>
        </div>
      </div>

      <div className="absolute bottom-6 flex flex-col items-center text-g2 text-xs space-y-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;