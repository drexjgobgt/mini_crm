import pool from "../config/database.js";
import { sanitizeObject } from "../utils/sanitize.js";

export const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params; // Sudah divalidasi oleh middleware

    // Verify customer exists
    const customerCheck = await pool.query(
      "SELECT id FROM customers WHERE id = $1",
      [customerId]
    );
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const result = await pool.query(
      "SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC LIMIT 1000",
      [customerId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customer_id, order_date, total_amount, status, notes } = req.body;

    // Verify customer exists
    const customerCheck = await pool.query(
      "SELECT id FROM customers WHERE id = $1",
      [customer_id]
    );
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Sanitize input
    const sanitizedData = {
      customer_id,
      order_date,
      total_amount: parseFloat(total_amount),
      status: status || "pending",
      notes: notes ? sanitizeObject(notes) : null,
    };

    // Validate total_amount
    if (isNaN(sanitizedData.total_amount) || sanitizedData.total_amount < 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    const result = await pool.query(
      "INSERT INTO orders (customer_id, order_date, total_amount, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        sanitizedData.customer_id,
        sanitizedData.order_date,
        sanitizedData.total_amount,
        sanitizedData.status,
        sanitizedData.notes,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    // Limit untuk prevent abuse
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const result = await pool.query(
      "SELECT o.*, c.name as customer_name FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.order_date DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM orders");
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
};
