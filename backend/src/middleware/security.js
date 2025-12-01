import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Rate limiting untuk prevent abuse
// Lebih longgar untuk development, bisa disesuaikan via env
const isDevelopment = process.env.NODE_ENV === "development";

// Helper untuk check jika request dari localhost
const isLocalhost = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "::ffff:127.0.0.1" ||
    req.hostname === "localhost" ||
    req.hostname === "127.0.0.1"
  );
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isDevelopment ? 1000 : 500, // Lebih banyak di development, 500 di production
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting untuk localhost di development
  skip: (req) => isDevelopment && isLocalhost(req),
  // Skip successful requests untuk mengurangi hit counter
  skipSuccessfulRequests: false,
});

// Rate limiting lebih ketat untuk create/update/delete operations
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isDevelopment ? 200 : 100, // Lebih banyak di development, 100 di production
  message: {
    error: "Too many modification requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting untuk localhost di development
  skip: (req) => isDevelopment && isLocalhost(req),
  // Skip successful requests untuk mengurangi hit counter
  skipSuccessfulRequests: false,
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


