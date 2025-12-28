import { Router } from 'express';
import * as controller from './category.controller';

const router = Router();

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);

export default router;
