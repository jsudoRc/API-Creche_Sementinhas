import  express  from "express";
import  routes from "./routes";
import cors from 'cors'
import { errorHandler } from "./middlewares/error-handler";

export const app = express()

// Permite que o Express entenda JSON no corpo das requisições (req.body)
app.use(cors());//2. Libera a catraca para o Front-end entrar com requisições
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API Creche Sementinhas funcionando');
});

// Pluga todas as rotas
app.use(routes);

// O middleware de erro DEVE ser sempre o último 'app.use'
app.use(errorHandler);
