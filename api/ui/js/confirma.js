import api from "./api.js";

const confirma = {
    listaGlobal: [], // Armazena todos os colaboradores carregados

    // Carregar todos os colaboradores
    async renderizarTodos() {
        try {
            this.listaGlobal = await api.listarT();
        } catch (error) {
            console.error("Erro ao carregar colaboradores:", error);
        }
    },

    // Renderizar os dados no card
    renderizarTabela(colaborador) {
        const modalDados = document.getElementById("resultadoWrapper");
        const dadosConfirm = document.getElementById("data-confirm");

        const alerta = document.querySelector(".alert");
        alerta.style.display = "none"

        if (!colaborador) {
            alerta.innerText = "❌ Matrícula não encontrada. Verifique o número informado."
            alerta.style.display = "block"
             modalDados.style.display = "none"
        } else{
            modalDados.style.display = "block"
            dadosConfirm.innerHTML = `
            <p><strong>Nome:</strong> ${colaborador.nome}</p>
            <p><strong>Setor:</strong> ${colaborador.setor}</p>
        `;
        }

    },

    // Buscar colaborador pela matrícula exata
    buscarColab(matriculaDigitada) {
        return this.listaGlobal.find(colab => colab.matricula === matriculaDigitada);
    },

    confirmarPresença(id) {
        return api.atualizaStatus(id, {status: "confirmado"});

    },

};

export default confirma;


// ===============================
// EVENTOS – APENAS APÓS CARREGAR
// ===============================
    document.addEventListener("DOMContentLoaded", () => {

        // 1️⃣ Carrega todos os colaboradores ao abrir a página
        confirma.renderizarTodos();

        // 2️⃣ Elementos
        const inputMat = document.getElementById("inputMatricula");
        const btnVerificar = document.getElementById("btnVerificar");

        const btnConfirme_CreatQrcode = document.getElementById("btnConfirmarQr");
        const Qrcode_area = document.getElementById("qrcode");
        const btn_baixar = document.getElementById("btn-download");

        // 3️⃣ Evento do botão "Verificar"
        btnVerificar.addEventListener("click", () => {
            const valor = inputMat.value.trim();
            const modalDados = document.getElementById("resultadoWrapper");

            const alerta2 = document.querySelector(".alert");
            alerta2.style.display = "none"
            Qrcode_area.style.display = "none"
            btn_baixar.style.display = "none"

            if (!valor) {
                Qrcode_area.style.display = "none"
                btn_baixar.style.display = "none"
                modalDados.style.display = "none"
                alerta2.innerText = "❌ Digite uma matrícula"
                alerta2.style.display = "block"
                return;
            }

            // Busca o colaborador
            const colaboradorEncontrado = confirma.buscarColab(valor);

            // Salva o colaborador encontrado
            confirma.colaboradorAtual = colaboradorEncontrado;

            // Renderiza dados (ou erro)
            confirma.renderizarTabela(colaboradorEncontrado);
        });

        btnConfirme_CreatQrcode.addEventListener("click", async () => {
            // garante que temos pelo menos a matrícula
            if (!confirma.colaboradorAtual) {
                alert("Nenhum colaborador verificado!");
                return;
            }

            let user = confirma.colaboradorAtual;

            // se não tiver _id, busca do backend pela matrícula
            if (!user._id) {
                try {
                    const fetched = await api.buscarColaborador(user.matricula); // deve retornar o objeto completo
                    if (!fetched || !fetched._id) {
                        alert("Não foi possível recuperar o colaborador com id do servidor.");
                        return;
                    }
                    user = fetched;
                    confirma.colaboradorAtual = fetched; // atualiza cache local
                } catch (err) {
                    console.error("Erro ao buscar colaborador por matrícula:", err);
                    alert("Erro ao buscar colaborador.");
                    return;
                }
            }

            // agora temos o _id — atualiza o status
            try {
                await api.atualizaStatus(user._id, { status: "confirmado" });
                console.log("Status atualizado para CONFIRMADO");
            } catch (err) {
                console.error("Erro ao confirmar presença:", err);
                alert("Erro ao confirmar presença.");
                return;
            }

            // segue com o comportamento atual (mostrar QR)
            Qrcode_area.style.display = "block";
            btn_baixar.style.display = "inline";

            // ===== Gerar QR Code =====
            const matricula = inputMat.value.trim();
            if (!matricula) {
                alert("Digite a matrícula!");
                return;
            }

            // Limpa canvas antigo (opcional)
            Qrcode_area.innerHTML = "";
            
            // cria canvas dinamicamente se não existir
            let canvas = document.createElement("canvas");
            Qrcode_area.appendChild(canvas);

            try {
                await QRCode.toCanvas(canvas, matricula, { width: 200 });
                console.log("QR Code gerado com sucesso!");
            } catch (err) {
                console.error("Erro ao gerar QR Code:", err);
                alert("Erro ao gerar QR Code.");
            }
        });

        function baixarQRCode() {
            const user = confirma.colaboradorAtual;
            const canvas = document.querySelector("#qrcode canvas");

            if (!canvas) {
                alert("QR Code ainda não foi gerado!");
                return;
            }

            const link = document.createElement("a");
            link.download = `qrcode_${user.nome}_.png`; // nome do arquivo
            link.href = canvas.toDataURL("image/png");
            link.click();
        }

        btn_baixar.addEventListener("click", ()=> {
            baixarQRCode()
        })
});
