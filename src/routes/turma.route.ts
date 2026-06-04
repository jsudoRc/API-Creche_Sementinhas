// src/routes/turma.routes.ts

import { Router } from 'express';
import { turmaController } from '../controllers/turma.controller';

const router = Router();

// Buscar todas as turmas
router.get('/', turmaController.getAll);

// Buscar turma por ID
router.get('/:id', turmaController.getById);

// Criar turma
router.post('/', turmaController.create);

// Atualizar turma
router.put('/:id', turmaController.update);

// Excluir turma
router.delete('/:id', turmaController.delete);

export default router;