import User from "../models/userModel.js";
/* import QRCode from "qrcode"; */

export async function listarTodos(req, res) {
  try {
    const colaboradores = await User.find().sort({nome:1});
    res.json(colaboradores)
  } catch (error) {
        console.error(error);
        res.status(500).json({error: " controller - Erro ao listar"})
  }
}

export async function cadastrarcolaborador(req, res){
  try {
    const { matricula, nome, setor, email, casa, status, qrcode } = req.body;

    // 🔍 1. Verifica se já existe colaborador com a mesma matrícula
    const existente = await User.findOne({ matricula });
    if (existente) {
      return res.status(400).json({
        error: "Já existe um colaborador cadastrado com essa matrícula."
      });
    }

    // 🆕 2. Cria o colaborador
    const novoColaborador = await User.create({
      matricula,
      nome,
      setor,
      email,
      casa,
      status: status || "nao",
      qrcode: qrcode || "",
      horaPresenca: null
    });

    // ✔️ 3. Retorna sucesso
    res.status(201).json({
      message: "Colaborador cadastrado com sucesso!",
      colaborador: novoColaborador
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar colaborador" });
  }
};

export async function atualizaStatusC(req, res) {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body; // <-- corrigido

    // 🔍 Verifica se o colaborador existe
    const colaborador = await User.findById(id);
    if (!colaborador) {
      return res.status(404).json({ error: "Colaborador não encontrado." });
    }

    // 🔄 Atualiza com os dados enviados
    const atualizado = await User.findByIdAndUpdate(
      id,
      { $set: dadosAtualizados },
      { new: true }
    );

    // ✔️ Retorna o atualizado
    res.json({
      message: "Status atualizado com sucesso!",
      colaborador: atualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
}

export const buscarPorMatricula = async (req, res) => {
    try {
        const { matricula } = req.params;

        const user = await User.findOne({ matricula });

        if (!user) {
            return res.status(404).json({ erro: "Colaborador não encontrado" });
        }

        return res.json(user);

    } catch (erro) {
        console.error("Erro ao buscar por matrícula:", erro);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
};