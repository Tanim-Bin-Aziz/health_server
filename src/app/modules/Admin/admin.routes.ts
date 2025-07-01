import express from "express";
import { AdminController } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { adminValidationsSchemas } from "./admin.validations";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(adminValidationsSchemas.update),
  AdminController.updateIntoDB
);
router.delete("/:id", AdminController.deleteFromDb);
router.delete("/soft/:id", AdminController.softDeleteFromDb);

export const AdminRoutes = router;
