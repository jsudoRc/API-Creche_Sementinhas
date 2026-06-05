import { Router } from 'express';
import { alunoController } from '../controllers/aluno.controller';

const router = Router();

router.get('/', alunoController.list);
router.get('/:id', alunoController.getById);
router.post('/', alunoController.create);
router.put('/:id', alunoController.update);
router.delete('/:id', alunoController.remove);

export default router;