import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const errorMidlleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
)=>{
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({message: err.message});
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Internal server error"
    })
}