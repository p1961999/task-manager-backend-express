"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleTask = exports.updateSingleTask = exports.createNewTask = exports.getSingleTask = exports.getAllTasks = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncHandler_1 = require("../utils/asyncHandler");
const task_service_1 = require("../services/task.service");
const getQueryParam = (value) => {
    return typeof value === "string" ? value : undefined;
};
exports.getAllTasks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(getQueryParam(req.query.page) || 1);
    const limit = Number(getQueryParam(req.query.limit) || 10);
    const data = await (0, task_service_1.getTasks)(req.user.userId, {
        page,
        limit,
        status: getQueryParam(req.query.status),
        priority: getQueryParam(req.query.priority),
        sortBy: getQueryParam(req.query.sortBy),
        sortOrder: getQueryParam(req.query.sortOrder),
        search: getQueryParam(req.query.search),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(data);
});
exports.getSingleTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const taskId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
    const task = await (0, task_service_1.getTaskById)(req.user.userId, taskId);
    res.status(http_status_codes_1.StatusCodes.OK).json(task);
});
exports.createNewTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await (0, task_service_1.createTask)(req.user.userId, req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: "Task created successfully",
        task,
    });
});
exports.updateSingleTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // const task = await updateTask(req.user!.userId, req.params.id, req.body);
    const taskId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
    const task = await (0, task_service_1.updateTask)(req.user.userId, taskId, req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Task updated successfully",
        task,
    });
});
exports.deleteSingleTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // await deleteTask(req.user!.userId, req.params.id);
    const taskId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
    const task = await (0, task_service_1.deleteTask)(req.user.userId, taskId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Task deleted successfully",
    });
});
