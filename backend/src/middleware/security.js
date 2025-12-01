import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Rate limiting untuk prevent abuse
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 requests per window
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting lebih ketat untuk create/update/delete operations
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20, // maksimal 20 requests per window
  message: {
    error: "Too many modification requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting untuk export
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 10, // maksimal 10 exports per jam
  message: {
    error: "Too many export requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});


