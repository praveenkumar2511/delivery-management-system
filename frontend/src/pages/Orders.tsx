import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWarehouse } from "../features/warehouse/wareHouseSlice";
import { fetchAgents } from "../features/agent/agentSlice";
import { RootState } from "../app/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import OrderList from "./OrderList";
import {createOrder} from "../features/order/orderSlice"
import axios from "axios";
const OrderForm = () => {
  const dispatch = useDispatch();
  // const warehouses = useSelector((state: RootState) => state.warehouse.data);
    
  // const warehouseLoading = useSelector((state: RootState) => state.warehouse.isLoading);
    const[wareHouse,setWareHouse]=useState([])
  console.log(wareHouse,">>>>>>>>>>>>>>>>>>>>>>>");
  
  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/warehouses");
        setWareHouse(response.data); 
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    };

    fetchWarehouse()
  }, []);
// console.log("warehouses:", warehouses, warehouseLoading)
  const agents = useSelector((state: RootState) => state.agent.data);


  
  const [form, setForm] = useState({
    warehouseId: "",
    agentId: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryDate: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    // dispatch(fetchWarehouse() as any);
    dispatch(fetchAgents() as any);
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting Order:", form);
    
    try {
        await dispatch(createOrder(form) as any); 
        setMessage("Order created successfully!");
  

      setMessage(" Order created successfully!");
      setForm({
        warehouseId: "",
        agentId: "",
        address: "",
        latitude: "",
        longitude: "",
        deliveryDate: "",
      });
    } catch (error: any) {
      console.error(error);
      setMessage("Failed to create order");
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <Label htmlFor="warehouseId">Warehouse</Label>
             <select
              name="warehouseId"
              value={form.warehouseId}
              onChange={handleChange}
              required
              // disabled={warehouseLoading}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring"
            >
              <option value="">
                 Select Warehouse
              </option>
              {wareHouse.map((wh:any) => (
                <option key={wh._id} value={wh._id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Agent</Label>
            <select
              name="agentId"
              value={form.agentId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Agent</option>
              {agents.map((agent: any) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Enter address"
            />
          </div>

          {/* Latitude */}
          <div>
            <Label>Latitude</Label>
            <Input
              type="number"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              step="any"
              required
            />
          </div>

          {/* Longitude */}
          <div>
            <Label>Longitude</Label>
            <Input
              type="number"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              step="any"
              required
            />
          </div>

          {/* Delivery Date */}
          <div>
            <Label>Delivery Date</Label>
            <Input
              type="datetime-local"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Order
          </Button>

          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
      </div>
      <div>
        <OrderList />
      </div>
    </div>
  );
};

export default OrderForm;

