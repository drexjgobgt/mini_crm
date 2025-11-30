import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers.js";
import orderRoutes from "./routes/orders.js";
import followupRoutes from "./routes/followups.js";
import {
  apiLimiter,
  strictLimiter,
  securityHeaders,
} from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(securityHeaders);

// CORS configuration - hanya izinkan origin tertentu
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan requests tanpa origin (mobile apps, Postman, dll) hanya di development
      if (!origin && process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser dengan size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/followups", followupRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (harus di akhir)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
