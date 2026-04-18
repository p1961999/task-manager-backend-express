import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser
} from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    user
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  res.status(StatusCodes.OK).json({
    message: "Login successful",
    ...result
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await refreshUserToken(req.body.refreshToken);

  res.status(StatusCodes.OK).json({
    message: "Access token refreshed",
    ...result
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUser(req.body.refreshToken);

  res.status(StatusCodes.OK).json({
    message: "Logged out successfully"
  });
});