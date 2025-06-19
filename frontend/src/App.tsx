import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Orders from "./pages/Orders";
import WarehouseForm from "./components/WarehouseForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/warehouses/new" element={<WarehouseForm />} />

      </Routes>
    </Router>
  );
}

export default App;
