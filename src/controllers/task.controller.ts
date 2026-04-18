import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/task.service";

const getQueryParam = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

export const getAllTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = Number(getQueryParam(req.query.page) || 1);
    const limit = Number(getQueryParam(req.query.limit) || 10);

    const data = await getTasks(req.user!.userId, {
      page,
      limit,
      status: getQueryParam(req.query.status),
      priority: getQueryParam(req.query.priority),
      sortBy: getQueryParam(req.query.sortBy),
      sortOrder: getQueryParam(req.query.sortOrder),
      search: getQueryParam(req.query.search),
    });

    res.status(StatusCodes.OK).json(data);
  },
);

export const getSingleTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const task = await getTaskById(req.user!.userId, taskId);

    res.status(StatusCodes.OK).json(task);
  },
);

export const createNewTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await createTask(req.user!.userId, req.body);

    res.status(StatusCodes.CREATED).json({
      message: "Task created successfully",
      task,
    });
  },
);

export const updateSingleTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // const task = await updateTask(req.user!.userId, req.params.id, req.body);
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const task = await updateTask(req.user!.userId, taskId, req.body);

    res.status(StatusCodes.OK).json({
      message: "Task updated successfully",
      task,
    });
  },
);

export const deleteSingleTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // await deleteTask(req.user!.userId, req.params.id);
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const task = await deleteTask(req.user!.userId, taskId);

    res.status(StatusCodes.OK).json({
      message: "Task deleted successfully",
    });
  },
);
