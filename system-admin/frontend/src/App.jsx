import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Delivery from "./pages/Delivery";
import Staff from "./pages/Staff";
import Statistics from "./pages/Statistics";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <>
      <Routes>

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
          <Route path="/delivery" element={
            <ProtectedRoute>
              <Delivery/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/staff" element={
            <ProtectedRoute>
              <Staff/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics/>
            </ProtectedRoute>
          } />
        </Route>
        <Route element={ <Sidebar /> }>
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar/>
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