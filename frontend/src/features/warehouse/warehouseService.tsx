import axios from "axios";
const API_URL = "http://127.0.0.1:5000";


const createWarehouse = async (userData: any) => {
    console.log(userData,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
    
  try {
    const response = await axios.post(`${API_URL}/api/warehouses/newWh`, userData);


    if (response.data) {
      // ✅ Save user and token
      console.log('====================================');
      console.log(response,"<<<<<<<<<<<<<<<<<<<<<<<<");
      console.log('====================================');
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const fetchWarehouse = async () => {
    
  try {
    const response = await axios.get(`${API_URL}/api/warehouses`);


    if (response.data) {
      // ✅ Save user and token
      console.log(response, "fetchwarehouse");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const warehouseService = {
    createWarehouse,
    fetchWarehouse
}


export default warehouseService