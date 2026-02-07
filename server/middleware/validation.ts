/**
 * Request validation middleware
 * Validates request payloads against Zod schemas
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ErrorResponse } from "@shared/types/editor";

/**
 * Creates a validation middleware for a specific schema
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.errors || { message: error.message },
      };
      res.status(400).json(errorResponse);
    }
  };
};

/**
 * Validates request parameters
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed as any;
      next();
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: "Invalid parameters",
        code: "INVALID_PARAMS",
        details: error.errors || { message: error.message },
      };
      res.status(400).json(errorResponse);
    }
  };
};

/**
 * Validates query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as any;
      next();
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        error: "Invalid query parameters",
        code: "INVALID_QUERY",
        details: error.errors || { message: error.message },
      };
      res.status(400).json(errorResponse);
    }
  };
};
