import { useState, useEffect } from "react";
import { api } from "../services/api";

function FollowupList() {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    loadFollowups();
  }, []);

  const loadFollowups = async () => {
    try {
      const response = await api.getFollowups();
      setFollowups(response.data);
    } catch (error) {
      console.error("Error loading followups:", error);
    }
  };

  const handleComplete = async (id) => {
    if (!id || !Number.isInteger(Number(id))) {
      alert("Invalid followup ID");
      return;
    }

    try {
      await api.completeFollowup(id);
      loadFollowups();
      alert("Follow-up berhasil ditandai sebagai selesai");
    } catch (error) {
      console.error("Error completing followup:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Gagal menandai follow-up sebagai selesai";
      alert(errorMessage);
    }
  };

  const isOverdue = (followupDate) => {
    return new Date(followupDate) < new Date();
  };

  const sortedFollowups = [...followups].sort(
    (a, b) =>
      new Date(a.followup_date || a.due_date) -
      new Date(b.followup_date || b.due_date)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Reminder Follow-up
      </h1>

      {sortedFollowups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">
            Tidak ada follow-up yang perlu dilakukan
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFollowups.map((followup) => (
            <div
              key={followup.id}
              className={`bg-white rounded-lg shadow p-6 ${
                isOverdue(followup.followup_date || followup.due_date)
                  ? "border-l-4 border-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {followup.customer_name}
                    </h3>
                    {isOverdue(followup.followup_date || followup.due_date) && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Terlambat
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">📞 {followup.phone}</p>
                  <p className="text-gray-700 mb-3">
                    {followup.notes || followup.message || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 Jatuh tempo:{" "}
                    {new Date(
                      followup.followup_date || followup.due_date
                    ).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleComplete(followup.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-4"
                >
                  ✓ Selesai
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FollowupList;
