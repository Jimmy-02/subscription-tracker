import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  code?: number; // Mongoose duplicate key error
  errors?: Record<string, { message: string }>; // Mongoose ValidationError
}

const errorMiddleware = (err: AppError,req: Request,res: Response,next: NextFunction,) => {
  try {
    let error: AppError = { ...err, message: err.message };

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      error = new Error("Resource not found") as AppError;
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      error = new Error("Duplicate field value entered") as AppError;
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError" && err.errors) {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", ")) as AppError;
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;