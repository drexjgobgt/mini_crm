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

// Request interceptor (logging dihapus untuk mengurangi console noise)
apiClient.interceptors.request.use(
  (config) => {
    // Logging dihapus - uncomment jika perlu debugging
    // if (import.meta.env.DEV) {
    //   console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Retry logic dengan exponential backoff
const retryRequest = async (config, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Exponential backoff: 1s, 2s, 4s
      if (i > 0) {
        const delay = Math.pow(2, i - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return await apiClient(config);
    } catch (error) {
      // Only retry on 429 (Too Many Requests) or network errors
      if (
        i === retries - 1 ||
        (error.response?.status !== 429 && error.response?.status !== undefined)
      ) {
        throw error;
      }
      // Continue to retry
    }
  }
};

// Response interceptor untuk error handling dengan retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
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
          // Rate limited - retry dengan exponential backoff
          console.warn("Rate limited, retrying...");
          try {
            // Retry GET requests automatically
            if (error.config && error.config.method?.toLowerCase() === "get") {
              const retryDelay = Math.pow(2, 1) * 1000; // 2 seconds
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              return apiClient(error.config);
            }
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
          console.error("Too Many Requests - Please wait before trying again");
          break;
        case 500:
          console.error("Server Error");
          break;
        default:
          console.error("API Error:", data);
      }
    } else if (error.request) {
      // Request was made but no response received - retry network errors
      console.warn("Network Error, retrying...");
      try {
        if (error.config && error.config.method?.toLowerCase() === "get") {
          const retryDelay = 1000; // 1 second
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return apiClient(error.config);
        }
      } catch (retryError) {
        console.error("Retry failed:", retryError);
      }
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
