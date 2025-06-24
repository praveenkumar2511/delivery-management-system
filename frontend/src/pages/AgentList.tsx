import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgents, checkIn, checkOut } from "../features/agent/agentSlice";
import { RootState, AppDispatch } from "../app/store";
import { Button } from "@/components/ui/button";

const calculateWage = (agent: any) => {
  let totalOrders = 0;
  let totalHours = 0;
  let totalKm = 0;

  if (Array.isArray(agent.sessions)) {
    agent.sessions.forEach((s: any) => {
      totalOrders += s.ordersCompleted || 0;
      totalHours += Math.min(s.hoursWorked || 0, 10);
      totalKm += Math.min(s.kmCovered || 0, 100);
    });
  }

  if (totalOrders >= 50) return totalOrders * 42;
  if (totalOrders >= 25) return totalOrders * 35;
  return 500;
};

const AgentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agent.data);
  console.log(agents,"agentsagentsagents");
  
  const loading = useSelector((state: RootState) => state.agent.isLoading);

  useEffect(() => {
    dispatch(fetchAgents() as any);
  }, [dispatch]);

  const handleCheckIn = async (id: string) => {
    console.log("is clicked>>>>>>>>>>>>>>>>>>>");
    await dispatch(checkIn(id));
    dispatch(fetchAgents());
  };

  const handleCheckOut = async (id: string) => {
    console.log("is clicked/////////////////////////////");

    await dispatch(checkOut(id));
    dispatch(fetchAgents());
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Agents List & Wages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Warehouse</th>
                <th className="border px-4 py-2">Check-In</th>
                <th className="border px-4 py-2">Hours Worked</th>
                <th className="border px-4 py-2">KM Covered</th>
                <th className="border px-4 py-2">Wage (₹)</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent: any) => (
                <tr key={agent._id}>
                  <td className="border px-4 py-2">{agent.name}</td>
                  <td className="border px-4 py-2">
                    {agent.warehouseId?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {agent.isCheckedIn ? "✅ Checked In" : "❌ Checked Out"}
                  </td>
                  <td className="border px-4 py-2">{agent.hoursWorked ?? 0}</td>
                  <td className="border px-4 py-2">{agent.kmCovered ?? 0}</td>
                  <td className="border px-4 py-2">{calculateWage(agent)}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(agent._id)}
                      disabled={agent.isCheckedIn} 
                    >
                      Check In
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCheckOut(agent._id)}
                      disabled={!agent.isCheckedIn}
                    >
                      Check Out
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentList;
