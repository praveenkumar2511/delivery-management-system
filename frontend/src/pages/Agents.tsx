import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { createAgent } from "../features/agent/agentSlice";
import { AppDispatch, RootState } from "@/app/store"; // adjust path to your store
import { fetchWarehouse } from "../features/warehouse/wareHouseSlice"; // 👈 Import here


interface Warehouse {
  _id: string;
  name: string;
}

const AgentForm = () => {
  const [form, setForm] = useState({
    name: "",
    warehouseId: "",
    checkInTime: "",
    hoursWorked: 0,
    kmCovered: 0,
  });

  //   const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const warehouses = useSelector((state: RootState) => state.warehouse.data);
  console.log(warehouses,"warehouseswarehouses");
  
  const warehouseLoading = useSelector((state: RootState) => state.warehouse.isLoading);

  //   useEffect(() => {
  //     api.get("/warehouses").then((res:any) => setWarehouses(res.data));
  //   }, []);

useEffect(() => {
  dispatch(fetchWarehouse() as any);
}, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "hoursWorked" || name === "kmCovered" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await dispatch(createAgent(form) as any);
      setMessage("✅ Agent created successfully!");
      setForm({
        name: "",
        warehouseId: "",
        checkInTime: "",
        hoursWorked: 0,
        kmCovered: 0,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Agent Name"
            required
          />
        </div>

        <div>
          <Label>Warehouse</Label>
          <select
            name="warehouseId"
            value={form.warehouseId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">
              {warehouseLoading ? "Loading Warehouses..." : "Select Warehouse"}
            </option>
            {warehouses.map((wh:any) => (
              <option key={wh._id} value={wh._id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Check-in Time</Label>
          <Input
            type="datetime-local"
            name="checkInTime"
            value={form.checkInTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Hours Worked</Label>
          <Input
            type="number"
            name="hoursWorked"
            value={form.hoursWorked}
            onChange={handleChange}
            step="any"
            required
          />
        </div>

        <div>
          <Label>KM Covered</Label>
          <Input
            type="number"
            name="kmCovered"
            value={form.kmCovered}
            onChange={handleChange}
            step="any"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Create Agent"}
        </Button>

        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AgentForm;
