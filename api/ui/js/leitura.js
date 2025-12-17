import api from "./api.js";

let scannerAtivo = false;
let html5QrCode;

// ELEMENTOS DA TELA
const btnCamera = document.getElementById("btnCamera");
const alertaDuplicado = document.getElementById("alertaDuplicado");
const iconsCam = document.getElementById("icons_scan")


// ======================================================
// ATIVAR CAMERA
// ======================================================
btnCamera.addEventListener("click", () => {
    if (!scannerAtivo) iniciarCamera();
});

// ======================================================
// INICIAR SCANNER
// ======================================================
async function iniciarCamera() {
    scannerAtivo = true;
    iconsCam.style.display = "none"


    // O ID deve existir no HTML → <div id="cameraArea"></div>
    html5QrCode = new Html5Qrcode("cameraArea");

    await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 150 },
        async (decodedText) => {
            await processarQRCode(decodedText);
        }
    );
}

// Fechar camera ao ler
async function pararCamera() {
    try {
        if (html5QrCode) {
            await html5QrCode.stop(); // encerra a câmera
            await html5QrCode.clear(); // limpa a div
        }

        scannerAtivo = false;
        iconsCam.style.display = "block"; // mostra de volta os ícones se quiser
        console.log("Câmera encerrada.");
    } catch (err) {
        console.error("Erro ao parar a câmera:", err);
    }
}

// ======================================================
// PROCESSAR MATRÍCULA LIDA DO QR CODE
// ======================================================
async function processarQRCode(matricula) {
    console.log("QR LIDO:", matricula);
    pararCamera()

    try {
        // 1️⃣ BUSCA O COLABORADOR COMPLETO PELA MATRÍCULA
        const colaborador = await api.buscarColaborador(matricula);

        if (!colaborador || !colaborador._id) {
            console.warn("Colaborador não encontrado no servidor.");
            return;
        }

        // 2️⃣ ATUALIZA STATUS PARA "presente" COM HORA
        let payload = {
            status: "presente"
        };

        // só grava hora se ainda não existia
        if (!colaborador.horaPresenca) {
            payload.horaPresenca = new Date().toISOString();
        }

        const dados = await api.atualizaStatus(colaborador._id, payload);

        // SE O COLABORADOR FOI LIDO PELA 1 VEZ
        
        if (colaborador.status != "presente") {
            alertaDuplicado.style.display = "block";
            const horaFormatada = new Date(colaborador.horaPresenca).toLocaleTimeString("pt-BR");
            alertaDuplicado.classList.add("presentes-header");
            alertaDuplicado.innerHTML =
                `Presença confirmada: <strong>${colaborador.nome}</strong>`;
            return;
        }

        // 3️⃣ SE O BACKEND DIZER "duplicado" → já foi registrado
        if (colaborador.status === "presente") {
            alertaDuplicado.style.display = "block";
            const horaFormatada = new Date(colaborador.horaPresenca).toLocaleTimeString("pt-BR");
            alertaDuplicado.classList.remove("presentes-header");
            alertaDuplicado.innerHTML =
                `<strong>${colaborador.nome}</strong> — Presença já registrada hoje às 
                 <strong>${horaFormatada}</strong>.`;
            return;
        }

    } catch (erro) {
        console.error("Erro ao registrar presença", erro);
    }
}