import { StatusCodes } from "http-status-codes";
import { Task } from "../models/task.model";
import { ApiError } from "../utils/ApiError";

type GetTasksQuery = {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
};

export const getTasks = async (userId: string, query: GetTasksQuery) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = query;

  const filter: Record<string, unknown> = { user: userId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  const now = new Date();

  const completed = await Task.countDocuments({
    user: userId,
    status: "done",
  });

  const inProgress = await Task.countDocuments({
    user: userId,
    status: "in-progress",
  });

  const overdue = await Task.countDocuments({
    user: userId,
    status: { $ne: "done" },
    dueDate: { $lt: now },
  });

  const totalPages = Math.ceil(total / limit);

  const summary = {
    total,
    completed,
    inProgress,
    overdue,
  };

  const pagination = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { tasks, summary, pagination };
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
  }

  return task;
};

export const createTask = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    status?: "pending" | "in-progress" | "done";
    priority?: "low" | "medium" | "high";
    dueDate?: string;
  }
) => {
  return Task.create({
    user: userId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: "pending" | "in-progress" | "done";
    priority?: "low" | "medium" | "high";
    dueDate?: string | null;
  }
) => {
  const updateData: Record<string, unknown> = { ...data };

  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    updateData,
    { new: true }
  );

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
  }

  return task;
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
  }
};