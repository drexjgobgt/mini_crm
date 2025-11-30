import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import CustomerForm from "./CustomerForm";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !Number.isInteger(Number(id))) {
      alert("Invalid customer ID");
      return;
    }

    if (window.confirm("Yakin ingin menghapus pelanggan ini?")) {
      try {
        await api.deleteCustomer(id);
        loadCustomers();
        alert("Pelanggan berhasil dihapus");
      } catch (error) {
        console.error("Error deleting customer:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Gagal menghapus pelanggan";
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  };

  const handleExport = () => {
    api.exportExcel();
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    const matchTag = filterTag === "all" || customer.tags?.includes(filterTag);
    return matchSearch && matchTag;
  });

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Data Pelanggan</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📥 Export Excel
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah Pelanggan
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Cari nama atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Tag</option>
            <option value="langganan">Langganan</option>
            <option value="rewel">Rewel</option>
            <option value="potensial">Potensial</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link
                  to={`/customers/${customer.id}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                >
                  {customer.name}
                </Link>
                <div className="mt-2 space-y-1 text-gray-600">
                  <p>📞 {customer.phone}</p>
                  {customer.email && <p>✉️ {customer.email}</p>}
                  {customer.address && <p>📍 {customer.address}</p>}
                </div>
                <div className="mt-3 flex gap-2">
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Tidak ada pelanggan ditemukan</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CustomerForm customer={editingCustomer} onClose={handleFormClose} />
      )}
    </div>
  );
}

export default CustomerList;
