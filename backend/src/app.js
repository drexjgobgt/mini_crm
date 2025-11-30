import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers.js";
import orderRoutes from "./routes/orders.js";
import followupRoutes from "./routes/followups.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/followups", followupRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
