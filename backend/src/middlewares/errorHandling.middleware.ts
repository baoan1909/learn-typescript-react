import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "../types/error.type";

export const errorHandlingMiddleware = (error: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
        message: error.message || "Server Error",
        success: false,
    }
}