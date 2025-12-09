import { Router } from 'express';
import * as controller from './category.controller';

const router = Router();

router.get('/', controller.getCategories); // GET /api/v1/category
router.post('/', controller.createCategory); // POST /api/v1/category

export default router;
