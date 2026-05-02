import { useContext, useState } from 'react';
import { User, Settings as SettingsIcon, Moon, Sun, Lock,
  ShieldCheck, RefreshCcw, X
 } from 'lucide-react';
import themeContext from '../context/theme/themeContext';
import authContext from '../context/auth/authContext';

const Settings = () => {
  const { admin, editAdmin } = useContext(authContext);
  const { theme, toggleTheme } = useContext(themeContext);
  const [ form, setForm ] = useState({});
  const [ changePass, setChangePass ] = useState(false);

  return (
    <div className="relative bg-app-bg text-app-text p-8 overflow-y-auto custom-scrollbar h-screen transition-colors duration-300">
  <h1 className="text-3xl font-bold mb-8">Settings</h1>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
    
    <section className="bg-app-card p-6 rounded-xl shadow-sm border border-app-border transition-colors">
      <div className="flex items-center mb-4 gap-2 text-app-text opacity-90">
        <SettingsIcon size={20} />
        <h2 className="text-xl font-semibold">System Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 opacity-80">System Version</label>
          <p className="w-full p-2 bg-transparent border border-app-border rounded-md focus:ring-2 focus:ring-b2 outline-none text-app-text">
            My Admin System v1.1
          </p>
        </div>
      </div>
    </section>

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

    {/* Account Settings Section */}
    <section className="bg-app-card p-6 rounded-xl shadow-sm border border-app-border md:col-span-2 transition-colors">
      <div className="flex items-center mb-6 gap-2 text-app-text opacity-90">
        <User size={20} />
        <h2 className="text-xl font-semibold">Account Settings</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-b1 rounded-full flex items-center justify-center text-wh1 relative group border-4 border-app-border">
            <User size={40} />
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Display Name</label>
            <input type="text" className="w-full p-2 bg-transparent border border-app-border rounded-md outline-none text-app-text"
            value={form?.name || admin?.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Email Address</label>
            <input type="email" className="w-full p-2 bg-transparent border border-app-border rounded-md outline-none text-app-text"
            value={form?.email || admin?.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
          </div>
          <button className="md:col-span-2 mt-2 w-fit flex items-center gap-2 text-sm font-semibold text-app-text hover:opacity-70 transition cursor-pointer"
          onClick={() => setChangePass(true)}>
            <Lock size={14} /> Change Password
          </button>
        </div>
      </div>
    </section>
  </div>

  {/* Save Button */}
  <div className="w-full mt-8 flex justify-end">
    <button className="bg-b1 text-wh1 px-8 py-2 rounded-lg hover:brightness-110 transition shadow-md font-medium cursor-pointer active:scale-95"
    onClick={() => {
      if (form?.name || form?.email || form?.password)
      editAdmin(form, setForm);
    }} >
      Save Changes
    </button>
  </div>
  {changePass && <ChangePassword onClose={() => setChangePass(false)} />}
</div>
  );
};

const ChangePassword = ({ onClose }) => {
  const { editAdmin } = useContext(authContext);
  const [form, setForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });

  return (
    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center p-6 h-screen w-screen bg-black/70 backdrop-blur-[2px]"
    onClick={onClose}>
      <div className="relative w-full max-w-md bg-app-card rounded-[2.5rem] border border-app-border p-8 shadow-2xl shadow-black/20"
      onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-5 right-5 z-10">
          <button 
            className="p-2.5 rounded-full bg-app-bg border border-app-border text-app-text opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-200 cursor-pointer group active:scale-90"
            onClick={onClose}
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex p-4 rounded-3xl bg-b1/10 text-b1 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-app-text tracking-tighter uppercase">Security</h2>
          <p className="text-[10px] font-bold text-app-text/40 uppercase tracking-widest mt-1">Update your account password</p>
        </div>

        <div className="space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-app-text/40 ml-1">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={form.currentPass || ""}
              className="w-full bg-app-bg px-5 py-4 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none transition-all text-app-text placeholder:opacity-20 font-bold"
              onChange={(e) => setForm({ ...form, currentPass: e.target.value })}
            />
          </div>

          <hr className="border-app-border/50 my-2" />

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-app-text/40 ml-1">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={form.newPass || ""}
              className="w-full bg-app-bg px-5 py-4 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none transition-all text-app-text placeholder:opacity-20 font-bold"
              onChange={(e) => setForm({ ...form, newPass: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-app-text/40 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={form.confirmPass || ""}
              className="w-full bg-app-bg px-5 py-4 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none transition-all text-app-text placeholder:opacity-20 font-bold"
              onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-b1 hover:bg-b2 text-white font-black py-4 rounded-2xl shadow-xl shadow-b1/20 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] transition-all cursor-pointer"
            onClick={async () => await editAdmin(form, setForm)}
          >
            <RefreshCcw size={18} /> UPDATE PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;