import pool from "../config/database.js";
import ExcelJS from "exceljs";
import { sanitizeObject } from "../utils/sanitize.js";

export const getFollowups = async (req, res, next) => {
  try {
    // Perbaiki query untuk menggunakan status bukan completed
    const result = await pool.query(
      "SELECT f.*, c.name as customer_name, c.phone FROM followups f JOIN customers c ON f.customer_id = c.id WHERE f.status = $1 ORDER BY f.followup_date ASC LIMIT 1000",
      ["pending"]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createFollowup = async (req, res, next) => {
  try {
    const { customer_id, due_date, message } = req.body;

    // Verify customer exists
    const customerCheck = await pool.query(
      "SELECT id FROM customers WHERE id = $1",
      [customer_id]
    );
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Sanitize input
    const sanitizedMessage = message ? sanitizeObject(message) : null;

    // Gunakan followup_date bukan due_date, dan status bukan completed
    const result = await pool.query(
      "INSERT INTO followups (customer_id, followup_date, notes, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_id, due_date, sanitizedMessage, "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const completeFollowup = async (req, res, next) => {
  try {
    const { id } = req.params; // Sudah divalidasi oleh middleware

    // Check if followup exists
    const checkResult = await pool.query(
      "SELECT id FROM followups WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Followup not found" });
    }

    // Update status bukan completed
    const result = await pool.query(
      "UPDATE followups SET status = $1 WHERE id = $2 RETURNING *",
      ["completed", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const exportToExcel = async (req, res, next) => {
  try {
    // Limit export untuk prevent abuse
    const limit = 10000; // Max 10k records
    const customers = await pool.query(
      "SELECT id, name, phone, email, address, tags, notes, created_at FROM customers ORDER BY name LIMIT $1",
      [limit]
    );

    if (customers.rows.length === 0) {
      return res.status(404).json({ error: "No data to export" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Pelanggan");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nama", key: "name", width: 30 },
      { header: "Telepon", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Alamat", key: "address", width: 40 },
      { header: "Tag", key: "tags", width: 20 },
      { header: "Catatan", key: "notes", width: 40 },
      { header: "Tanggal Dibuat", key: "created_at", width: 20 },
    ];

    customers.rows.forEach((customer) => {
      worksheet.addRow({
        id: customer.id,
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        tags: customer.tags ? customer.tags.join(", ") : "",
        notes: customer.notes || "",
        created_at: customer.created_at
          ? new Date(customer.created_at).toLocaleDateString("id-ID")
          : "",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `pelanggan_${timestamp}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};
