import axios from "axios";
import qs from "qs"; // Import qs for encoding
import { toast } from "sonner";
import * as XLSX from "xlsx";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "http://127.0.0.1:3000";


const login = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
      email: userData.email,
      password: userData.password,
    });

    if (response.data) {
      // ✅ Save user and token
      const { token, data } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
// const login = async (userData: any) => {
//   try {
//     // const formData = new FormData();
//     const encodedData = qs.stringify({
//       cmd: "login",
//       usr: userData.email,
//       pwd: userData.password,
//     });

//     const response = await axios.post(`${API_URL}api/v1/login`, encodedData, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     if (response.data) {
//       localStorage.setItem("user", JSON.stringify(response.data));
//     }

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// Get Net Sales Report function
// const getNetSalesReport = async (filters: {
//   fromDate: string;
//   toDate: string;
//   warehouse: string;
//   barcode: string;
// }) => {
//   try {
//     // Retrieve the stored user token (if required)

//     const payload = {
//       report_name: "Net Sales Report",
//       report_type: "csv",
//       limit: "1000",
//       page: "1",
//       from_date: filters.fromDate, // Pass filters
//       to_date: filters.toDate,
//       warehouse: filters.warehouse,
//       barcode: filters.barcode,
//     };

//     const response = await axios.post(
//       `${API_URL}/api/method/netSalesReport`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${user.token}`, // Add token if authentication is required
//         },
//       }
//     );

//     console.log(response.data, "//////////////////////////////////////");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };



// const getReportData = async (filters:any,report_name:any) => {
//   console.log(report_name,"nnnnnnnnnnnnnnnnnnnnnnnnnnn");
//   const convertToBackendDate = (dateString: string) => {
//     if (!dateString) return null;
//     const [day, month, year] = dateString.split("/").map(Number);
//     return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//   };
//   try {
//     const payload = {
//       report_name: report_name,
//       report_type: "json",
//       limit:1000,
//       offset:1,
//       // filters: [
//       //   {
//       //     from_date: convertToBackendDate(filters.fromDate),
//       //     to_date: convertToBackendDate(filters.toDate),
//       //   },

//       // ],
//     };  

//     const response = await axios.post(`${API_URL}/api/method/getreport`, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "token 671ee6fc8b2a7c9:376250902beab63", 
//       },
//     });

//     console.log(response.data, "Received Report Data");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching report:", error);
//     toast.error("Failed to fetch report data.");
//     return null;
//   }
// };

// export const fetchAndDownloadReportNew = async (filters:any, report_name:any) => {
//   console.log(report_name,"rrrrrrrrrrrrrrrrrrrrrr");
  
//   try {
//     const reportData = await getReportData(filters,report_name);
//     console.log(reportData,"vvvvvvvvvvvvvvvvvvvvvvvv");
    
//     const dataArray = Array.isArray(reportData?.message) ? reportData.message : [];

//     if (!dataArray.length) {
//       console.error("No data found for the report:", reportData);
//       toast.error("No data available to download!");
//       return;
//     }

//     handleDownloadExcel(dataArray, `${report_name}`);
//   } catch (error) {
//     console.error("Error downloading report:", error);
//   }
// };

const getReportsData = async (filters:any,report_name:any) => {
  console.log(report_name,"nnnnnnnnnnnnnnnnnnnnnnnnnnn");
  // const convertToBackendDate = (dateString: string) => {
  //   if (!dateString) return null;
  //   const [day, month, year] = dateString.split("/").map(Number);
  //   return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  // };
  console.log(filters);
  
  try {
    const payload = {
      report_name: report_name,
      report_type: "json",
      limit:1000,
      offset:1,
    //   filters: [
    //     {
    //       from_date: convertToBackendDate(filters.fromDate),
    //       to_date: convertToBackendDate(filters.toDate),
    //     },

    //   ],
    // }; 
    } 

    const response = await axios.post(`${API_URL}/api/method/new_getreport`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "token 671ee6fc8b2a7c9:1dba38d1e44a0d5", 
      },
    });

    console.log(response.data, "Received Report Data");
    return response.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    toast.error("Failed to fetch report data.");
    return null;
  }
};

export const fetchAndDownloadReporstNew = async (filters:any, report_name:any) => {
  console.log(report_name,"rrrrrrrrrrrrrrrrrrrrrr");
  
  try {
    const reportData = await getReportsData(filters,report_name);
    console.log(reportData,"vvvvvvvvvvvvvvvvvvvvvvvv");
    
    const dataArray = Array.isArray(reportData?.message) ? reportData.message : [];

    if (!dataArray.length) {
      console.error("No data found for the report:", reportData);
      toast.error("No data available to download!");
      return;
    }

    handleDownloadExcel(dataArray, `${report_name}`);
  } catch (error) {
    console.error("Error downloading report:", error);
  }
};




//Price Config api functions

export const price_config = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/method/priceConfig`);

    console.log(response.data, "Received Price Config Report Data");
    return response.data;
  } catch (error) {
    console.error("Error fetching price config report:", error);
    toast.error("Failed to fetch price config report data.");
    return null;
  }
}



// Daily Updates
export const daily_details = async (date: string | Date) => {
  // const payload = { new_date : "2025-02-11 00:00:00"  };
  const payload = {
    new_date:date
  }
// console.log(payload,"............................,,,,,,,,,,,,,,,,,,,,");

  try {
    const response = await axios.post(
      `${API_URL}/api/method/get_dashboard_carddatas`, // Ensure correct endpoint
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data, "✅ Received Daily Details Data");
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching daily details:", error.response?.data || error.message);

    // Show a toast error notification
    toast.error(error.response?.data?.message || "Failed to fetch daily details.");

    return null;
  }
};



//EXCEL//
const handleDownloadExcel = (jsonData: any, filename: string) => {
  if (!jsonData || jsonData.length === 0) {
    toast.error("Excel Download Failed!!!", { duration: 2000 });
    return;
  }

  try {
    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);

    // Trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    toast.success("Downloaded Successfully", { duration: 2000 });
  } catch (error) {
    console.error("Excel download error:", error);
    toast.error("Excel Download Failed!!!", { duration: 2000 });
  }
};


const authService = {
  login,
  // Final Report Api
  // fetchAndDownloadReportNew,
  fetchAndDownloadReporstNew,
  //Price Config api
  price_config,
  // Daily Updates Api  - daily_details is not used in the current code, but it's a placeholder for future updates.
  daily_details
};

export default authService;
