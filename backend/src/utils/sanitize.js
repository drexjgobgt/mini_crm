import xss from "xss";

// XSS options untuk sanitization
const xssOptions = {
  whiteList: {}, // Tidak ada HTML tags yang diizinkan
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
};

// Sanitize string input
export const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return xss(str.trim(), xssOptions);
};

// Sanitize object recursively
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === "object") {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

// Sanitize email
export const sanitizeEmail = (email) => {
  if (!email) return email;
  return email.toLowerCase().trim();
};

// Sanitize phone
export const sanitizePhone = (phone) => {
  if (!phone) return phone;
  // Hanya izinkan angka, +, -, spasi, dan tanda kurung
  return phone.replace(/[^0-9+\-\s()]/g, "");
};


