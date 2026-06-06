import { Router } from 'express';
import { responsavelTransporteController } from '../controllers/responsavel-transporte.controller';

const router = Router();
router.get('/', responsavelTransporteController.list);
router.get('/:id', responsavelTransporteController.getById);
router.post('/', responsavelTransporteController.create);
router.put('/:id', responsavelTransporteController.update);
router.delete('/:id', responsavelTransporteController.remove);

export default router;