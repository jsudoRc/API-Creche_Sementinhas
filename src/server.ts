import { app } from './app';
import { ensureDefaultFuncionario } from './database/default-data';

// Do jeito certo para a nuvem:
const PORT = process.env.PORT || 3000;

ensureDefaultFuncionario()
  .catch((err) => {
    console.error('Erro ao garantir funcionário padrão:', err);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  });
