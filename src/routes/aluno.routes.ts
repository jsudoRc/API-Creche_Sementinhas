import { Router } from 'express';
import { alunoController } from '../controllers/aluno.controller';
import { upload } from '../config/multer';

const router = Router();

router.get('/', alunoController.list);
router.get('/:id', alunoController.getById);
router.post('/', upload.fields([
    { name: 'autorizacao_img', maxCount: 1 },
    { name: 'receita_antitermico', maxCount: 1 }
]), alunoController.create);
router.put('/:id', upload.fields([
    { name: 'autorizacao_img', maxCount: 1 },
    { name: 'receita_antitermico', maxCount: 1 }
]), alunoController.update);
router.delete('/:id', alunoController.remove);

export default router;