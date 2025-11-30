import pool from "../config/database.js";
import {
  sanitizeObject,
  sanitizeEmail,
  sanitizePhone,
} from "../utils/sanitize.js";

export const getAllCustomers = async (req, res, next) => {
  try {
    // Limit dan pagination untuk prevent abuse
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000); // Max 1000 records
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const result = await pool.query(
      "SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) FROM customers");
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

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params; // Sudah divalidasi oleh middleware
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    // Sanitize input
    const { name, phone, email, address, tags, notes } = req.body;
    const sanitizedData = {
      name: sanitizeObject(name),
      phone: phone ? sanitizePhone(phone) : null,
      email: email ? sanitizeEmail(email) : null,
      address: address ? sanitizeObject(address) : null,
      tags: Array.isArray(tags) ? tags : [],
      notes: notes ? sanitizeObject(notes) : null,
    };

    const result = await pool.query(
      "INSERT INTO customers (name, phone, email, address, tags, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        sanitizedData.name,
        sanitizedData.phone,
        sanitizedData.email,
        sanitizedData.address,
        sanitizedData.tags,
        sanitizedData.notes,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params; // Sudah divalidasi oleh middleware

    // Sanitize input
    const { name, phone, email, address, tags, notes } = req.body;
    const sanitizedData = {
      name: sanitizeObject(name),
      phone: phone ? sanitizePhone(phone) : null,
      email: email ? sanitizeEmail(email) : null,
      address: address ? sanitizeObject(address) : null,
      tags: Array.isArray(tags) ? tags : [],
      notes: notes ? sanitizeObject(notes) : null,
    };

    const result = await pool.query(
      "UPDATE customers SET name=$1, phone=$2, email=$3, address=$4, tags=$5, notes=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *",
      [
        sanitizedData.name,
        sanitizedData.phone,
        sanitizedData.email,
        sanitizedData.address,
        sanitizedData.tags,
        sanitizedData.notes,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params; // Sudah divalidasi oleh middleware

    // Check if customer exists first
    const checkResult = await pool.query(
      "SELECT id FROM customers WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
