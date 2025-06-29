import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import httpStatus from "http-status";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await AdminService.getAllFromDB(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.name : "something went wrong",
      error: err,
    });
  }
};
const getByIdFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id",
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

const updateIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data updated!!",
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

const deleteFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteFromDb(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted",
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

const softDeleteFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDb(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted",
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
  updateIntoDB,
  getByIdFromDB,
  getAllFromDB,
  deleteFromDb,
  softDeleteFromDb,
};
