import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import { Orders } from "./pages/Orders";
import Settings from "./pages/Settings";
import { useContext } from "react";
import authContext from "./context/auth/authContext";

const App = () => {
  const { authenticated } = useContext(authContext);

  return (
    <>
      <Routes>
        <Route path="/" element={
          !authenticated
            ? <LoginPage />
            : <Navigate to="/dashboard" replace />
        } />
        <Route element={ <Sidebar /> }>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/products" element={
            <ProtectedRoute>
              <Products/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          } />
        </Route>

      </Routes>
    </>
  )
}

export default App