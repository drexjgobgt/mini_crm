import pool from "../config/database.js";
import ExcelJS from "exceljs";

export const getFollowups = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT f.*, c.name as customer_name, c.phone FROM followups f JOIN customers c ON f.customer_id = c.id WHERE f.completed = false ORDER BY f.due_date ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFollowup = async (req, res) => {
  try {
    const { customer_id, due_date, message } = req.body;
    const result = await pool.query(
      "INSERT INTO followups (customer_id, due_date, message) VALUES ($1, $2, $3) RETURNING *",
      [customer_id, due_date, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE followups SET completed = true WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportToExcel = async (req, res) => {
  try {
    const customers = await pool.query("SELECT * FROM customers ORDER BY name");

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
    ];

    customers.rows.forEach((customer) => {
      worksheet.addRow({
        ...customer,
        tags: customer.tags ? customer.tags.join(", ") : "",
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=pelanggan.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
