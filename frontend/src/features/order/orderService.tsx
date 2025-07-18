import axios from "axios";
const API_URL = "http://127.0.0.1:5000";


const createOrder = async (userData: any) => {
    
  try {
    const response = await axios.post(`${API_URL}/api/order/newOrder`, userData);


    if (response.data) {
      // ✅ Save user and token
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const fetchOrder = async () => {
    
  try {
    const response = await axios.get(`${API_URL}/api/order`);


    if (response.data) {
      // ✅ Save user and token
      console.log(response,"<<<<<<<<<<<<<<<<<<<<<<<<");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


const markAsReceived = async (id: string) => {
  const res = await axios.patch(`${API_URL}/api/order/${id}/receive`);
  return res.data;
};

const markAsDelivered = async (id: string) => {
  const res = await axios.patch(`${API_URL}/api/order/${id}/deliver`);
  return res.data;
};
const warehouseService = {
    createOrder,
    fetchOrder,
    markAsReceived,
  markAsDelivered,

}


export default warehouseService