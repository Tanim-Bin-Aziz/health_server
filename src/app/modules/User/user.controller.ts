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

export const userController = {
  createAdmin,
};
