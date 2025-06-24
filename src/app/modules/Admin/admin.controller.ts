import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    // console.log(req.query);
    const result = await AdminService.getAllFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin data fetched",
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

export const AdminController = {
  getAllFromDB,
};
