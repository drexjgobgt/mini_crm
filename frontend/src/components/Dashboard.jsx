import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingFollowups: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, orders, followups] = await Promise.all([
        api.getCustomers(),
        api.getOrders(),
        api.getFollowups(),
      ]);
      setStats({
        totalCustomers: customers.data.length,
        totalOrders: orders.data.length,
        pendingFollowups: followups.data.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Total Pelanggan</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Total Pesanan</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Follow-up Pending</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.pendingFollowups}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/customers"
          className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Kelola Pelanggan
          </h2>
          <p className="text-gray-600">
            Lihat, tambah, dan edit data pelanggan Anda
          </p>
        </Link>

        <Link
          to="/followups"
          className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Reminder Follow-up
          </h2>
          <p className="text-gray-600">
            Kelola jadwal follow-up dengan pelanggan
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
