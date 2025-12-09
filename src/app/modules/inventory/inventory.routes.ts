import express from 'express';
import {
  createItem,
  useItem,
  restockItem,
  dashboard,
  getRestocks,
  getInventoryItems,
  getUsageHistory,
} from './inventory.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// 🔹 Admin-only routes
router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  createItem,
);
router.post(
  '/use',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  useItem,
);
router.post(
  '/restock',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  restockItem,
);

router.get(
  '/dashboard',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  dashboard,
);
router.get(
  '/restocks',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  getRestocks,
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  getInventoryItems,
);
router.get(
  '/usage',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  getUsageHistory,
);

export const InventoryRoutes = router;
