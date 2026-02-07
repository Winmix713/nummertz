/**
 * Error handling middleware
 * Catches and formats errors consistently
 */

import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "@shared/types/editor";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number = 500,
    message: string = "Internal Server Error",
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Global error handler middleware
 * Should be added as the last middleware
 */
export const errorHandler = (
  error: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log error
  console.error("Error:", error);

  // Handle API errors
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      details: error.details,
    };
    return res.status(error.statusCode).json(response);
  }

  // Handle generic errors
  const response: ErrorResponse = {
    error: "Internal Server Error",
    code: "INTERNAL_ERROR",
    details: {
      message: error.message,
    },
  };

  res.status(500).json(response);
};

/**
 * Wraps async route handlers to catch errors
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Creates a 404 handler
 */
export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const response: ErrorResponse = {
    error: "Not Found",
    code: "NOT_FOUND",
  };
  res.status(404).json(response);
};
