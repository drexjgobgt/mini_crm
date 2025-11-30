function OrderHistory({ orders }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Belum ada pesanan</div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500">
                {new Date(order.order_date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          {order.items && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                <strong>Item:</strong> {order.items}
              </p>
            </div>
          )}
          {order.notes && (
            <p className="mt-2 text-sm text-gray-600">{order.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
