import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { newWarehouse } from "../features/warehouse/wareHouseSlice";

const WarehouseForm = () => {
  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(e,"isclickedddddddddddddddddddddd");
    
    setMessage("");
    setLoading(true);
    try {
      await dispatch(newWarehouse(form) as any); // ✅ Dispatch async thunk with form data
      setMessage("✅ Warehouse created successfully!");
      setForm({ name: "", latitude: "", longitude: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create warehouse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Warehouse</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Warehouse - Chennai"
            required
          />
        </div>
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            step="any"
            placeholder="13.0827"
            required
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            step="any"
            placeholder="80.2707"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Create Warehouse"}
        </Button>

        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default WarehouseForm;
