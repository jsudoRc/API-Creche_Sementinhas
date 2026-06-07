import { Router } from 'express';
import turmaRoutes from './turma.routes';
import funcionarioRoutes from './funcionario.routes';
import alunoRoutes from './aluno.routes';
import responsavelRoutes from './responsavel.routes';
import matriculaRoutes from './matricula.routes';
import arquivoRoutes from './arquivo.routes';
import responsavelTransporteRoutes from './responsavel-transporte.routes';
import contatoEmergenciaRoutes from './contato-emergencia.routes';

const router = Router();

// Define os prefixos das URLs da sua API
router.use('/turmas', turmaRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/alunos', alunoRoutes);
router.use('/responsaveis', responsavelRoutes);
router.use('/matriculas', matriculaRoutes);
router.use('/arquivos', arquivoRoutes);
router.use('/responsaveis-transporte', responsavelTransporteRoutes);
router.use('/contatos-emergencia', contatoEmergenciaRoutes);

export default router;