import { useEffect, useState } from "react";
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
import {
  fetchOrder,
  markAsReceived,
  markAsDelivered,
} from "../features/order/orderSlice";
import { RootState, AppDispatch } from "../app/store";

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.order.data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

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

  const handleMarkReceived = async (id: string) => {
    await dispatch(markAsReceived(id));
    await dispatch(fetchOrder());
  };

  const handleMarkDelivered = async (id: string) => {
    await dispatch(markAsDelivered(id));
    await dispatch(fetchOrder());
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
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.warehouseId?.name || "N/A"}</TableCell>
                      <TableCell>{Number(order.latitude).toFixed(4)}</TableCell>
                      <TableCell>{Number(order.longitude).toFixed(4)}</TableCell>
                      <TableCell>
                        {new Date(order.deliveryDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{order.status}</TableCell>
                      <TableCell className="flex flex-col gap-2">
                        <button
                          onClick={() => handleMarkReceived(order._id)}
                          disabled={order.status !== "pending"}
                          className="px-2 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                        >
                          Mark as Received
                        </button>
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          disabled={order.status !== "received"}
                          className="px-2 py-1 bg-green-600 text-white text-sm rounded disabled:opacity-50"
                        >
                          Mark as Delivered
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
