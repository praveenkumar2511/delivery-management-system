import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { fetchOrder } from "../features/order/orderSlice";
import { RootState } from "../app/store";
import { log } from "console";

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  console.log(orders,"99999999999999999999999999999999999")
  useEffect(() => {
    dispatch(fetchOrder() as any);
  }, [dispatch]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      <Card>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center py-4">No orders found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Dispatched</TableHead>
                    <TableHead>Delivery Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.warehouseId?.name || "N/A"}</TableCell>
                      <TableCell>{Number(order.latitude).toFixed(4)}</TableCell>
                      <TableCell>{Number(order.longitude).toFixed(4)}</TableCell>
                      <TableCell>{order.isDispatched ? "✅" : "❌"}</TableCell>
                      <TableCell>
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;
