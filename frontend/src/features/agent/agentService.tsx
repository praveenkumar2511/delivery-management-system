import axios from "axios";
const API_URL = "http://127.0.0.1:5000";

const createAgent = async (userData: any) => {
  console.log(userData, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");

  try {
    const response = await axios.post(
      `${API_URL}/api/agents/newAgent`,
      userData
    );

    if (response.data) {
      // ✅ Save user and token
      console.log("====================================");
      console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<");
      console.log("====================================");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const fetchAgent = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/agents`);

    if (response.data) {
      // ✅ Save user and token
      console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const checkInAgent = async (id: any) => {
  try {
    const response = await axios.patch(`${API_URL}/api/agents/${id}/checkin`);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const checkOutAgent = async (id: any) => {
  try {
    const res = await axios.patch(`${API_URL}/api/agents/${id}/checkout`);
    return res.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const agentService = {
  createAgent,
  fetchAgent,
  checkInAgent,
  checkOutAgent,
};

export default agentService;
