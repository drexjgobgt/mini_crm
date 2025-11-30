import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = {
  // Customers
  getCustomers: () => axios.get(`${API_URL}/customers`),
  getCustomer: (id) => axios.get(`${API_URL}/customers/${id}`),
  createCustomer: (data) => axios.post(`${API_URL}/customers`, data),
  updateCustomer: (id, data) => axios.put(`${API_URL}/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${API_URL}/customers/${id}`),

  // Orders
  getOrders: () => axios.get(`${API_URL}/orders`),
  getOrdersByCustomer: (customerId) =>
    axios.get(`${API_URL}/orders/customer/${customerId}`),
  createOrder: (data) => axios.post(`${API_URL}/orders`, data),

  // Followups
  getFollowups: () => axios.get(`${API_URL}/followups`),
  createFollowup: (data) => axios.post(`${API_URL}/followups`, data),
  completeFollowup: (id) => axios.patch(`${API_URL}/followups/${id}/complete`),
  exportExcel: () => window.open(`${API_URL}/followups/export`, "_blank"),
};
