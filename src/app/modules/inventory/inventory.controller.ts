import { Request, Response } from 'express';
import * as InventoryService from './inventory.service';

// 🔹 Create inventory item
export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await InventoryService.createInventoryItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Record usage
export const useItem = async (req: Request, res: Response) => {
  try {
    const usage = await InventoryService.recordItemUsage(req.body);
    res.status(201).json({ success: true, data: usage });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 🔹 Restock inventory
export const restockItem = async (req: Request, res: Response) => {
  try {
    const restock = await InventoryService.restockInventoryItem(req.body);
    res.status(201).json({ success: true, data: restock });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 🔹 Get all inventory items
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const items = await InventoryService.getAllInventoryItems();
    res.json({ success: true, data: items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Get inventory usage history
export const getUsageHistory = async (req: Request, res: Response) => {
  try {
    const usageHistory = await InventoryService.getInventoryUsageHistory();
    res.json({ success: true, data: usageHistory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Get all restocks
export const getRestocks = async (req: Request, res: Response) => {
  try {
    const restocks = await InventoryService.getAllRestocks();
    res.json({ success: true, data: restocks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Inventory dashboard
export const dashboard = async (req: Request, res: Response) => {
  try {
    const stats = await InventoryService.getInventoryDashboard();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
