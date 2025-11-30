import axios from "axios";

// Gunakan environment variable dengan fallback ke localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance dengan default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk logging (hanya di development)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data);
          break;
        case 401:
          console.error("Unauthorized");
          break;
        case 403:
          console.error("Forbidden");
          break;
        case 404:
          console.error("Not Found");
          break;
        case 429:
          console.error("Too Many Requests - Please wait before trying again");
          break;
        case 500:
          console.error("Server Error");
          break;
        default:
          console.error("API Error:", data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error: No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const api = {
  // Customers
  getCustomers: (params) => apiClient.get("/customers", { params }),
  getCustomer: (id) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return apiClient.get(`/customers/${id}`);
  },
  createCustomer: (data) => apiClient.post("/customers", data),
  updateCustomer: (id, data) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return apiClient.put(`/customers/${id}`, data);
  },
  deleteCustomer: (id) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return apiClient.delete(`/customers/${id}`);
  },

  // Orders
  getOrders: (params) => apiClient.get("/orders", { params }),
  getOrdersByCustomer: (customerId) => {
    if (
      !customerId ||
      !Number.isInteger(Number(customerId)) ||
      Number(customerId) < 1
    ) {
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return apiClient.get(`/orders/customer/${customerId}`);
  },
  createOrder: (data) => apiClient.post("/orders", data),

  // Followups
  getFollowups: () => apiClient.get("/followups"),
  createFollowup: (data) => apiClient.post("/followups", data),
  completeFollowup: (id) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      return Promise.reject(new Error("Invalid followup ID"));
    }
    return apiClient.patch(`/followups/${id}/complete`);
  },
  exportExcel: () => {
    // Open in new window untuk download
    window.open(`${API_URL}/followups/export`, "_blank");
  },
};
