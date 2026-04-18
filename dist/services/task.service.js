"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const http_status_codes_1 = require("http-status-codes");
const task_model_1 = require("../models/task.model");
const ApiError_1 = require("../utils/ApiError");
const getTasks = async (userId, query) => {
    const { page = 1, limit = 10, status, priority, sortBy = "createdAt", sortOrder = "desc", search, } = query;
    const filter = { user: userId };
    if (status)
        filter.status = status;
    if (priority)
        filter.priority = priority;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
        task_model_1.Task.find(filter).sort(sort).skip(skip).limit(limit),
        task_model_1.Task.countDocuments(filter),
    ]);
    const now = new Date();
    const completed = await task_model_1.Task.countDocuments({
        user: userId,
        status: "done",
    });
    const inProgress = await task_model_1.Task.countDocuments({
        user: userId,
        status: "in-progress",
    });
    const overdue = await task_model_1.Task.countDocuments({
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
exports.getTasks = getTasks;
const getTaskById = async (userId, taskId) => {
    const task = await task_model_1.Task.findOne({ _id: taskId, user: userId });
    if (!task) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, "Task not found");
    }
    return task;
};
exports.getTaskById = getTaskById;
const createTask = async (userId, data) => {
    return task_model_1.Task.create({
        user: userId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
};
exports.createTask = createTask;
const updateTask = async (userId, taskId, data) => {
    const updateData = { ...data };
    if (data.dueDate !== undefined) {
        updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    const task = await task_model_1.Task.findOneAndUpdate({ _id: taskId, user: userId }, updateData, { new: true });
    if (!task) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, "Task not found");
    }
    return task;
};
exports.updateTask = updateTask;
const deleteTask = async (userId, taskId) => {
    const task = await task_model_1.Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, "Task not found");
    }
};
exports.deleteTask = deleteTask;
