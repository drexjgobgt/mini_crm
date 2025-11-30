// Error handler untuk tidak expose sensitive information
export const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging (jangan kirim ke client)
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Jangan expose database errors atau stack traces ke client
  if (err.code && err.code.startsWith("23")) {
    // PostgreSQL constraint violation
    return res.status(400).json({
      error: "Invalid data provided",
      message: "The provided data violates database constraints",
    });
  }

  if (err.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      error: "Invalid reference",
      message: "Referenced record does not exist",
    });
  }

  if (err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      error: "Duplicate entry",
      message: "A record with this information already exists",
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "An error occurred while processing your request";

  res.status(statusCode).json({
    error: "Internal server error",
    message: message,
  });
};

// Not found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested resource was not found",
  });
};

