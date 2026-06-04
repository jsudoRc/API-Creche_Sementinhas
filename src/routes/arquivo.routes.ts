import { Router } from 'express';
import { arquivoController } from '../controllers/arquivo.controller';

const router = Router();
router.get('/', arquivoController.list);
router.get('/:id', arquivoController.getById);
router.post('/', arquivoController.create);
router.put('/:id', arquivoController.update);
router.delete('/:id', arquivoController.remove);

export default router;