import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderList from "./OrderList";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Warehouses", description: "Manage all your warehouses", path: "/warehouses" },
    { title: "Agents", description: "View and assign delivery agents", path: "/agents" },
    { title: "Orders", description: "Track and dispatch orders", path: "/orders" },
        // { title: "WarehouseForm", description: "Warehouse Form", path: "/warehouses/new" },

  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Delivery Management Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="shadow-md">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
              <Button className="mt-4 w-full" onClick={() => navigate(section.path)}>
                Go to {section.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <OrderList /> */}
    </div>
  );
};

export default Dashboard;
