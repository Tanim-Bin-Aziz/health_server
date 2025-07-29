import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

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

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile status changed!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
};
