import { Router } from "express";
import {
  createNewTask,
  deleteSingleTask,
  getAllTasks,
  getSingleTask,
  updateSingleTask
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllTasks);
router.post("/", validate(createTaskSchema), createNewTask);
router.get("/:id", getSingleTask);
router.put("/:id", validate(updateTaskSchema), updateSingleTask);
router.delete("/:id", deleteSingleTask);

export default router;