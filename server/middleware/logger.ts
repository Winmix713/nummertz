/**
 * Request logging middleware
 * Logs incoming requests and response times
 */

import { Request, Response, NextFunction } from "express";

/**
 * Request logger middleware
 * Logs method, URL, status code, and response time
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  const { method, url, path } = req;

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data: any) {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    // Only log API routes
    if (path.startsWith("/api/")) {
      const logLevel = status >= 400 ? "error" : "info";
      console.log(
        `[${logLevel.toUpperCase()}] ${method} ${url} - ${status} ${duration}ms`,
      );
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Detailed request logger (for development)
 * Logs request details including body and headers
 */
export const detailedRequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n[REQUEST] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
      console.log("Body:", JSON.stringify(req.body, null, 2));
    }
    if (Object.keys(req.params).length > 0) {
      console.log("Params:", req.params);
    }
  }

  next();
};
