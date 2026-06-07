import { Router } from 'express';
import { responsavelController } from '../controllers/responsavel.controller';

const router = Router();

router.get('/', responsavelController.list);
router.get('/:id', responsavelController.getById);
router.post('/', responsavelController.create);
router.put('/:id', responsavelController.update);
router.delete('/:id', responsavelController.remove);

export default router;