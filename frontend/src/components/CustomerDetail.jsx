import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import OrderHistory from "./OrderHistory";

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    order_date: new Date().toISOString().split("T")[0],
    total_amount: "",
    status: "pending",
    items: "",
    notes: "",
  });
  const [followupForm, setFollowupForm] = useState({
    due_date: "",
    message: "",
  });

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  const loadCustomerData = async () => {
    try {
      const [customerRes, ordersRes] = await Promise.all([
        api.getCustomer(id),
        api.getOrdersByCustomer(id),
      ]);
      setCustomer(customerRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error loading customer data:", error);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createOrder({ ...orderForm, customer_id: id });
      setShowOrderForm(false);
      setOrderForm({
        order_date: new Date().toISOString().split("T")[0],
        total_amount: "",
        status: "pending",
        items: "",
        notes: "",
      });
      loadCustomerData();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleFollowupSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createFollowup({ ...followupForm, customer_id: id });
      setShowFollowupForm(false);
      setFollowupForm({ due_date: "", message: "" });
      alert("Reminder follow-up berhasil ditambahkan!");
    } catch (error) {
      console.error("Error creating followup:", error);
    }
  };

  if (!customer) return <div>Loading...</div>;

  const getTagColor = (tag) => {
    const colors = {
      langganan: "bg-green-100 text-green-800",
      rewel: "bg-red-100 text-red-800",
      potensial: "bg-blue-100 text-blue-800",
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <button
        onClick={() => navigate("/customers")}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Kembali ke Daftar Pelanggan
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {customer.name}
            </h1>
            <div className="flex gap-2 mb-4">
              {customer.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowFollowupForm(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            + Set Reminder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="mb-2">
              📞 <strong>Telepon:</strong> {customer.phone}
            </p>
            {customer.email && (
              <p className="mb-2">
                ✉️ <strong>Email:</strong> {customer.email}
              </p>
            )}
          </div>
          <div>
            {customer.address && (
              <p className="mb-2">
                📍 <strong>Alamat:</strong> {customer.address}
              </p>
            )}
          </div>
        </div>

        {customer.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Catatan:</strong> {customer.notes}
            </p>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Histori Pesanan</h2>
          <button
            onClick={() => setShowOrderForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Tambah Pesanan
          </button>
        </div>
        <OrderHistory orders={orders} />
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Tambah Pesanan Baru</h3>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={orderForm.order_date}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, order_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={orderForm.total_amount}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, total_amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={orderForm.status}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Pesanan
                </label>
                <textarea
                  value={orderForm.items}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, items: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={orderForm.notes}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, notes: e.target.value })
                  }
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Followup Form Modal */}
      {showFollowupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Set Reminder Follow-up</h3>
            <form onSubmit={handleFollowupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Follow-up
                </label>
                <input
                  type="date"
                  required
                  value={followupForm.due_date}
                  onChange={(e) =>
                    setFollowupForm({
                      ...followupForm,
                      due_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan Reminder
                </label>
                <textarea
                  required
                  value={followupForm.message}
                  onChange={(e) =>
                    setFollowupForm({
                      ...followupForm,
                      message: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Follow up pesanan terakhir"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Set Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowFollowupForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetail;
