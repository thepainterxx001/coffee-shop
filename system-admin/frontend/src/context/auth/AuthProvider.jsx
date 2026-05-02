import { useState } from "react"
import authContext from "./authContext"
import { axiosAdmin } from "../../lib/axios.js";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AuthProvider = ({ children }) => {
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(true); 
  const [ admin, setAdmin ] = useState(null);

  const loginAdmin = async (body) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axiosAdmin.post("/login-admin", body);
      await checkAuth({ showLoading: false });
      toast.success(res?.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const editAdmin = async (body, setForm) => {
    setLoading(true);
    try {
      const res = await axiosAdmin.put(`/update-admin/${admin.id}`, body);
      await checkAuth({ showLoading: false });
      toast.success(res?.data.message);
      setForm({});
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const checkAuth = async ({ showLoading = false }) => {
    showLoading ? setLoading(true) : setLoading(false);
    
    try {
      const res = await axiosAdmin.get("/access-admin");
      setAuthenticated(true);
      setAdmin(res.data.admin);
    } catch (err) {
      console.log(err);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth({ showLoading: true });
  }, []);

  return (
    <authContext.Provider value={{ admin, editAdmin, checkAuth, authenticated, loginAdmin }}>
      { children }
    </authContext.Provider>
  )
}

export default AuthProvider