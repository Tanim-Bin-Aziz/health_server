import express from "express";
import { SpecialtiesController } from "./specialties.controller";

const router = express.Router();
router.post("/", SpecialtiesController.inserIntoDB);

export const SpecialtiesRoutes = router;
