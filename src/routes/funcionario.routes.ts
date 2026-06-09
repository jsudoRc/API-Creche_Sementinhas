import { Router } from 'express';
import { funcionarioController } from '../controllers/funcionario.controller';

const router = Router();

router.get('/', funcionarioController.list);
router.get('/:id', funcionarioController.getById);
router.post('/', funcionarioController.create);
router.post('/login', funcionarioController.login);

router.put('/:id', funcionarioController.update);
router.put('/:id/senha', funcionarioController.alterarSenha);

router.delete('/:id', funcionarioController.delete);

export default router;