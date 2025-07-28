import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response, next: unknown) => {
  try {
    const result = await userService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "admin created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.name : "something went wrong",
      error: err,
    });
  }
};
const createDoctor = async (req: Request, res: Response, next: unknown) => {
  try {
    const result = await userService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.name : "something went wrong",
      error: err,
    });
  }
};
const createPatient = async (req: Request, res: Response, next: unknown) => {
  try {
    const result = await userService.createPatient(req);
    res.status(200).json({
      success: true,
      message: "Patients created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.name : "something went wrong",
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
};
