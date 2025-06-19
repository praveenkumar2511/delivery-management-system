// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import axios from "axios";

// const WarehouseForm = () => {
//   const [form, setForm] = useState({
//     name: "",
//     latitude: "",
//     longitude: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e:any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e:any) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/warehouses", form);
//       setMessage("✅ Warehouse created successfully!");
//       setForm({ name: "", latitude: "", longitude: "" });
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Failed to create warehouse.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Add New Warehouse</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Name</Label>
//           <Input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Warehouse - Chennai"
//             required
//           />
//         </div>
//         <div>
//           <Label>Latitude</Label>
//           <Input
//             type="number"
//             name="latitude"
//             value={form.latitude}
//             onChange={handleChange}
//             step="any"
//             placeholder="13.0827"
//             required
//           />
//         </div>
//         <div>
//           <Label>Longitude</Label>
//           <Input
//             type="number"
//             name="longitude"
//             value={form.longitude}
//             onChange={handleChange}
//             step="any"
//             placeholder="80.2707"
//             required
//           />
//         </div>

//         <Button type="submit" disabled={loading} className="w-full">
//           {loading ? "Submitting..." : "Create Warehouse"}
//         </Button>

//         {message && <p className="text-sm text-center mt-2">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default WarehouseForm;


// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/app/store"; // adjust based on your path
// import {
//   newWarehouse,
//   fetchWarehouse,
//   reset,
// } from "@/features/warehouse/warehouseSlice";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// type FormValues = {
//   name: string;
//   latitude: number;
//   longitude: number;
// };

// const WarehouseForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { data: warehouses, isLoading, message } = useSelector(
//     (state: RootState) => state.warehouse
//   );

//   const {
//     register,
//     handleSubmit,
//     reset: resetForm,
//     formState: { errors },
//   } = useForm<FormValues>();

//   useEffect(() => {
//     dispatch(fetchWarehouse());
//   }, [dispatch]);

//   const onSubmit = async (data: FormValues) => {
//     await dispatch(newWarehouse(data));
//     resetForm(); // reset form after submission
//     dispatch(fetchWarehouse()); // refresh list
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 space-y-6">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="p-6 border rounded-lg shadow space-y-4"
//       >
//         <h2 className="text-2xl font-bold">Add New Warehouse</h2>

//         <div>
//           <Label>Name</Label>
//           <Input
//             {...register("name", { required: true })}
//             placeholder="Warehouse - Mumbai"
//           />
//           {errors.name && (
//             <p className="text-sm text-red-500">Name is required</p>
//           )}
//         </div>

//         <div>
//           <Label>Latitude</Label>
//           <Input
//             type="number"
//             step="any"
//             {...register("latitude", { required: true })}
//             placeholder="18.5204"
//           />
//           {errors.latitude && (
//             <p className="text-sm text-red-500">Latitude is required</p>
//           )}
//         </div>

//         <div>
//           <Label>Longitude</Label>
//           <Input
//             type="number"
//             step="any"
//             {...register("longitude", { required: true })}
//             placeholder="73.8567"
//           />
//           {errors.longitude && (
//             <p className="text-sm text-red-500">Longitude is required</p>
//           )}
//         </div>

//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Submitting..." : "Create Warehouse"}
//         </Button>

//         {message && <p className="text-sm mt-2 text-red-500">{message}</p>}
//       </form>

//       {/* ✅ Warehouse list below */}
//       <div className="border rounded-lg p-4">
//         <h3 className="text-xl font-semibold mb-2">Warehouse List</h3>
//         {warehouses.length > 0 ? (
//           <ul className="list-disc list-inside space-y-1">
//             {warehouses.map((wh) => (
//               <li key={wh.id}>
//                 {wh.name} – ({wh.latitude}, {wh.longitude})
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-500">No warehouses found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WarehouseForm;


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store"; // adjust path
import {
  newWarehouse,
  fetchWarehouse,
//   deleteWarehouse,
//   updateWarehouse,
  reset,
} from "../features/warehouse/wareHouseSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type FormValues = {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
};

const WarehouseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: warehouses, isLoading } = useSelector(
    (state: RootState) => state.warehouse
  );

  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    dispatch(fetchWarehouse());
  }, [dispatch]);

  const onSubmit = async (data: FormValues) => {
    // if (editingWarehouseId) {
    //   await dispatch(updateWarehouse({ id: editingWarehouseId, data }));
    //   setEditingWarehouseId(null);
    // } else {
    //   await dispatch(newWarehouse(data));
    // }
    dispatch(fetchWarehouse());
    resetForm();
  };

  const handleEdit = (wh: FormValues) => {
    setEditingWarehouseId(wh.id || null);
    setValue("name", wh.name);
    setValue("latitude", wh.latitude);
    setValue("longitude", wh.longitude);
  };

//   const handleDelete = async (id: string) => {
//     await dispatch(deleteWarehouse(id));
//     dispatch(fetchWarehouse());
//   };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 border rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-bold">
          {editingWarehouseId ? "Edit Warehouse" : "Add New Warehouse"}
        </h2>

        <div>
          <Label>Name</Label>
          <Input
            {...register("name", { required: true })}
            placeholder="Warehouse - Mumbai"
          />
          {errors.name && (
            <p className="text-sm text-red-500">Name is required</p>
          )}
        </div>

        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            step="any"
            {...register("latitude", { required: true })}
            placeholder="18.5204"
          />
          {errors.latitude && (
            <p className="text-sm text-red-500">Latitude is required</p>
          )}
        </div>

        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            step="any"
            {...register("longitude", { required: true })}
            placeholder="73.8567"
          />
          {errors.longitude && (
            <p className="text-sm text-red-500">Longitude is required</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {editingWarehouseId
            ? isLoading
              ? "Updating..."
              : "Update Warehouse"
            : isLoading
            ? "Creating..."
            : "Create Warehouse"}
        </Button>
      </form>

      {/* ✅ List of Warehouses */}
      <div className="border rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Warehouse List</h3>
        {warehouses.length > 0 ? (
          <ul className="space-y-2">
            {warehouses.map((wh:any) => (
              <li
                key={wh.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{wh.name}</p>
                  <p className="text-sm text-gray-500">
                    ({wh.latitude}, {wh.longitude})
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => handleEdit(wh)}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    // onClick={() => handleDelete(wh.id!)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No warehouses found.</p>
        )}
      </div>
    </div>
  );
};

export default WarehouseForm;
