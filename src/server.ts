import { app } from './app';

// Do jeito certo para a nuvem:
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});