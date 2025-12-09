import express from 'express';
import {
  getAllTreatments,
  createTreatment,
  updatePrice,
  deleteTreatment,
} from './treatment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

/**
 * GET /api/v1/treatment
 * Public: used by home page to list treatments
 */
router.get('/', getAllTreatments);

/**
 * Admin-only routes to manage treatments
 */
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  createTreatment,
);
router.patch(
  '/:id/price',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  updatePrice,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  deleteTreatment,
);

export const TreatmentRoutes = router;
