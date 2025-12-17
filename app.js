import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./api/config/db.js";
import userRoutes from "./api/routes/userRoutes.js";

// Config .env
dotenv.config();

// ==================
// Setup básico
// ==================
const app = express();

//__dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());

// ==================
// Arquivos estáticos
// ==================
app.use(express.static(path.join(__dirname, "pages")));


app.use("/user", userRoutes);

// Servir CSS e JS
app.use("/js", express.static(path.join(__dirname, "api", "ui", "js")));
app.use("/styles", express.static(path.join(__dirname, "api", "ui", "styles")));
app.use("/images", express.static(path.join(__dirname, "api", "ui", "images")));


// Rotas amigáveis 
app.get("/confirmacao", (req, res) => {
  res.sendFile(
    path.join(__dirname, "api", "ui", "pages", "confirma.html")
  );
});

app.get("/leitura", (req, res) => {
  res.sendFile(
    path.join(__dirname, "api", "ui", "pages", "leitura.html")
  );
});

app.get("/relatorio", (req, res) => {
  res.sendFile(
    path.join(__dirname, "api", "ui", "pages", "listagem.html")
  );
});

connectDB();

// ==================
// Start server
// ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});


/* docker run -p 3000:3000 --env-file .env minha-app */