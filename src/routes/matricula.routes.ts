import { Router } from 'express';
import { matriculaController } from '../controllers/matricula.controller';

const router = Router();

router.get('/', matriculaController.list);
router.get('/:id', matriculaController.getById);
router.post('/', matriculaController.create);
router.put('/:id', matriculaController.update);
router.delete('/:id', matriculaController.remove);

export default router;