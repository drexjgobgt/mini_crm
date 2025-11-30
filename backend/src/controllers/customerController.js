import pool from "../config/database.js";

export const getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, tags, notes } = req.body;
    const result = await pool.query(
      "INSERT INTO customers (name, phone, email, address, tags, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, phone, email, address, tags || [], notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, tags, notes } = req.body;
    const result = await pool.query(
      "UPDATE customers SET name=$1, phone=$2, email=$3, address=$4, tags=$5, notes=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *",
      [name, phone, email, address, tags, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
