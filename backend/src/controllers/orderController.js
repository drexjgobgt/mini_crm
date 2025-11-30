import pool from "../config/database.js";

export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await pool.query(
      "SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC",
      [customerId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customer_id, order_date, total_amount, status, items, notes } =
      req.body;
    const result = await pool.query(
      "INSERT INTO orders (customer_id, order_date, total_amount, status, items, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [customer_id, order_date, total_amount, status || "pending", items, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT o.*, c.name as customer_name FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.order_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
