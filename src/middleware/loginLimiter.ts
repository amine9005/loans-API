import rateLimiter from "express-rate-limit";

const loginLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 attempts per window per 'window' for each IP address
  message: {
    message: "too many login attempts, please try again after a minute",
  },
  handler: (req, res, next, options) => {
    console.log("To many login attempts: " + options.message);
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the "Rate Limiter"
  legacyHeaders: false, // Disable the "X-Rate-Limit-*" headers
});

export default loginLimiter;
