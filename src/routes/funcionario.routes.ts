import { Router } from 'express';
import { funcionarioController } from '../controllers/funcionario.controller';

const router = Router();

router.get('/', funcionarioController.list);
router.get('/:id', funcionarioController.getById);
router.post('/', funcionarioController.create);
router.put('/:id', funcionarioController.update);
router.delete('/:id', funcionarioController.remove);

export default router;