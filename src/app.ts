import express from "express";
import routes from "./routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/error-handler";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

// Permite que o Express entenda JSON no corpo das requisições (req.body)
app.use(cors());
app.use(express.json());

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Pluga todas as rotas
app.use(routes);

// O middleware de erro DEVE ser sempre o último app.use
app.use(errorHandler);
