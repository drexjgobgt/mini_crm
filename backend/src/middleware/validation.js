import { body, param, validationResult } from "express-validator";

// Middleware untuk handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validasi ID parameter
export const validateId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

// Validasi customer data
export const validateCustomer = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters")
    .matches(/^[a-zA-Z0-9\s.,'-]+$/)
    .withMessage("Name contains invalid characters"),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Phone number contains invalid characters")
    .isLength({ max: 50 })
    .withMessage("Phone number must be less than 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Address must be less than 1000 characters"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      const validTags = ["langganan", "rewel", "potensial"];
      const invalidTags = tags.filter((tag) => !validTags.includes(tag));
      if (invalidTags.length > 0) {
        throw new Error(`Invalid tags: ${invalidTags.join(", ")}`);
      }
      return true;
    }),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Notes must be less than 5000 characters"),
  handleValidationErrors,
];

// Validasi order data
export const validateOrder = [
  body("customer_id")
    .isInt({ min: 1 })
    .withMessage("Customer ID must be a positive integer")
    .toInt(),
  body("order_date")
    .isISO8601()
    .withMessage("Order date must be a valid date (ISO 8601 format)")
    .toDate(),
  body("total_amount")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number")
    .toFloat(),
  body("status")
    .optional()
    .isIn(["pending", "processing", "completed", "cancelled"])
    .withMessage("Invalid status value"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Notes must be less than 5000 characters"),
  handleValidationErrors,
];

// Validasi followup data
export const validateFollowup = [
  body("customer_id")
    .isInt({ min: 1 })
    .withMessage("Customer ID must be a positive integer")
    .toInt(),
  body("due_date")
    .isISO8601()
    .withMessage("Due date must be a valid date (ISO 8601 format)")
    .toDate(),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Message must be less than 2000 characters"),
  handleValidationErrors,
];

// Validasi customer ID parameter
export const validateCustomerId = [
  param("customerId")
    .isInt({ min: 1 })
    .withMessage("Customer ID must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

