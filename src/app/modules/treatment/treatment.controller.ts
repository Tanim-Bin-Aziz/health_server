import { Request, Response } from 'express';
import * as service from './treatment.service';
import {
  validateCreateTreatment,
  validateUpdatePrice,
} from './treatment.validation';

/**
 * Public: get all treatments
 */
export const getAllTreatments = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || undefined;
    const categoryId = (req.query.categoryId as string) || undefined;
    const data = await service.getAllTreatments(search, categoryId);
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * Admin: create treatment
 */
export const createTreatment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const errors = validateCreateTreatment(payload);
    if (errors.length)
      return res
        .status(400)
        .json({ success: false, message: errors.join(', ') });

    // Check duplicate by name
    const existing = await service.getAllTreatments(payload.name);
    if (
      existing.some(t => t.name.toLowerCase() === payload.name.toLowerCase())
    ) {
      return res
        .status(409)
        .json({
          success: false,
          message: 'Treatment with this name already exists',
        });
    }

    const created = await service.createTreatment({
      name: payload.name.trim(),
      price: Number(payload.price),
      categoryId: payload.categoryId,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * Admin: update treatment price
 */
export const updatePrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const errors = validateUpdatePrice(payload);
    if (errors.length)
      return res
        .status(400)
        .json({ success: false, message: errors.join(', ') });

    const found = await service.getTreatmentById(id);
    if (!found)
      return res
        .status(404)
        .json({ success: false, message: 'Treatment not found' });

    const updated = await service.updateTreatmentPrice(
      id,
      Number(payload.price),
    );
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Server error' });
  }
};

/**
 * Admin: delete treatment
 */
export const deleteTreatment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const found = await service.getTreatmentById(id);
    if (!found)
      return res
        .status(404)
        .json({ success: false, message: 'Treatment not found' });

    await service.deleteTreatment(id);
    return res.json({ success: true, message: 'Deleted' });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Server error' });
  }
};
