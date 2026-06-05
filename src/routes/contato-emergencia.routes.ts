import { Router } from 'express';
import { contatoEmergenciaController } from '../controllers/contato-emergencia.controller';

const router = Router();
router.get('/', contatoEmergenciaController.list);
router.get('/:id', contatoEmergenciaController.getById);
router.post('/', contatoEmergenciaController.create);
router.put('/:id', contatoEmergenciaController.update);
router.delete('/:id', contatoEmergenciaController.remove);

export default router;