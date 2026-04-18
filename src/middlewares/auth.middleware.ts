import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request{
    user?: {
        userId: string;
        email: string;
    };
}

export const authMiddleware = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = {
        userId: payload.userId,
        email: payload.email
    };
    next();
}