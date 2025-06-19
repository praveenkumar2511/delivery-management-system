import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/warehouses");
        setWarehouses(res.data);
      } catch (err) {
        console.error("Failed to fetch warehouses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">All Warehouses</h2>

      <Card>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading warehouses...</p>
          ) : warehouses.length === 0 ? (
            <p className="text-center py-4">No warehouses found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((w:any) => (
                  <TableRow key={w._id}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{w.latitude.toFixed(4)}</TableCell>
                    <TableCell>{w.longitude.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseList;
