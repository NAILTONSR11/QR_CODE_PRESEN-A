import express from "express";
import User from "../models/userModel.js"
import {
  listarTodos,
  cadastrarcolaborador,
  atualizaStatusC,
  buscarPorMatricula
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", listarTodos);
router.get("/:matricula", buscarPorMatricula)
router.post("/", cadastrarcolaborador);
router.put("/:id", atualizaStatusC);

// Rota para cadastrar múltiplos usuários de uma vez
router.post('/all', async (req, res) => {
    try {
        const usuarios = req.body;

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            return res.status(400).json({ message: 'Envie um array de usuários.' });
        }

        // Filtra apenas os campos obrigatórios e válidos
        const usuariosValidos = usuarios.filter(u =>
            u.matricula && u.nome && u.setor && u.email
        );

        if (usuariosValidos.length === 0) {
            return res.status(400).json({ message: 'Nenhum usuário válido enviado.' });
        }

        // Prepara operações bulkWrite para evitar erro de duplicata
        const ops = usuariosValidos.map(u => ({
            updateOne: {
                filter: { matricula: u.matricula },
                update: { $setOnInsert: u }, // insere apenas se não existir
                upsert: true
            }
        }));

        const resultado = await User.bulkWrite(ops);

        res.status(201).json({
            message: 'Usuários processados com sucesso!',
            totalEnviados: usuarios.length,
            totalValidos: usuariosValidos.length,
            resultado
        });

    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuários.', erro: err.message });
    }
});

// Excluir todos os usuários
router.delete('/all', async (req, res) => {
    try {
        const resultado = await User.deleteMany({}); // deleta todos os documentos da coleção
        res.status(200).json({ 
            message: 'Todos os usuários foram excluídos com sucesso.', 
            totalExcluidos: resultado.deletedCount 
        });
    } catch (err) {
        console.error('Erro ao excluir todos os usuários:', err);
        res.status(500).json({ message: 'Erro ao excluir usuários.', erro: err.message });
    }
});


export default router;