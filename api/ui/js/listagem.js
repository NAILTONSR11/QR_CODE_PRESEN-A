import api from "./api.js";

let todosColaboradores = []; // armazenar todos os dados carregados
let filtradosTab = []; // armazenar os filtrados no click dos tabs e é usado na pesquisa

const listagem = {
    // CARREGAR E RENDERIZAR TODOS
    async renderizarTodos() {
        try {
            todosColaboradores = await api.listarT(); // salva globalmente
            this.renderizarTabela(todosColaboradores); // serve os dados a função renderizarTabela
            this.atualizarCards(); //Chamar a função de contar os status
        } catch (error) {
            console.error("listagem ERRO: falha ao renderizar pessoas.", error);
        }
    },

    // FUNÇÃO QUE DESENHA A TABELA
    renderizarTabela(lista) {
        const tbody = document.getElementById("tbodyListagem");
        tbody.innerHTML = "";

        lista.forEach((colab) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${colab.matricula}</td>
                <td>${colab.nome}</td>
                <td>${colab.setor}</td>
                <td>${colab.email}</td>
                <td>${colab.casa}</td>
                <td>${colab.status}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    // BUSCA FILTRADA
    buscarColabs(termo) {
        termo = termo.toLowerCase();

        const filtrados = filtradosTab.filter(colab =>
            colab.nome.toLowerCase().includes(termo) ||
            colab.matricula.toLowerCase().includes(termo) ||
            colab.setor.toLowerCase().includes(termo) ||
            colab.casa.toLowerCase().includes(termo)
        );

        this.renderizarTabela(filtrados);
    },

    renderizaStatus() {
        const tabs = document.querySelectorAll(".tab");
    
            tabs.forEach((tab) => {
                tab.addEventListener("click", () => {
                    // Remove o "active" de todos
                    tabs.forEach(t => t.classList.remove("active"));
                    // Adiciona active no que foi clicado
                    tab.classList.add("active");

                //Filtrar de acordo com o tab clicado (Todos, confirmados e Presentes):
                    // Pega o tipo do filtro
                    const tipo = tab.dataset.tab;

                    /* let filtradosTab = []; */

                    if (tipo === "todos") {
                        filtradosTab = todosColaboradores;
                    }
                    else if (tipo === "confirmados") {
                        filtradosTab = todosColaboradores.filter(c => c.status === "confirmado");
                    }
                    else if (tipo === "presentes") {
                        filtradosTab = todosColaboradores.filter(c => c.status === "presente");
                    }

                    this.renderizarTabela(filtradosTab);
            });
        });

    
    },

    atualizarCards() {
    // Total de todos os colaboradores
    const total = todosColaboradores.length;

    // Total por status
    const preCadastro = total;
    const confirmados = todosColaboradores.filter(c => c.status === "confirmado").length;
    const presentes = todosColaboradores.filter(c => c.status === "presente").length;

    // Taxa de presença = presentes / total * 100
    const taxa = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;

    // Atualizar HTML
    document.getElementById("countPreCadastro").innerText = preCadastro;
    document.getElementById("countConfirmados").innerText = confirmados;
    document.getElementById("countPresentes").innerText = presentes;
    document.getElementById("taxaPresenca").innerText = `${taxa}%`;
    },

    baixarNomesCSV(lista) {
    // Cabeçalho do CSV
    let csvContent = "Nome,Casa\n";

    // Monta as linhas
    lista.forEach(colab => {
        const nome = colab.nome ?? "";
        const casa = colab.casa ?? "";
        csvContent += `${nome},`;
    });/* "${casa}"\n */

    // Cria um Blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "nomes_colaboradores.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  baixarNomesCSVPorCasa(lista) {
    // Agrupa por casa
    const grupos = lista.reduce((acc, colab) => {
        const casa = colab.casa ?? "Sem_Casa";

        if (!acc[casa]) {
            acc[casa] = [];
        }

        acc[casa].push(colab);
        return acc;
    }, {});

    // Para cada casa, cria um CSV
    Object.entries(grupos).forEach(([casa, colaboradores]) => {
        let csvContent = "Nome,Casa\n";

        colaboradores.forEach(colab => {
            const nome = colab.nome ?? "";
            csvContent += `"${nome}","${casa}"\n`;
        });

        // Cria o arquivo
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        // Remove espaços e caracteres problemáticos do nome do arquivo
        const nomeArquivo = `colaboradores_${casa.replace(/\s+/g, "_")}.csv`;
        link.download = nomeArquivo;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}


};

/* const btn_baixarLista = document.getElementById("btnCsv")
btn_baixarLista.addEventListener("click", () => {
    baixarNomesCSV(filtradosTab);
}); */

export default listagem;


// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    listagem.renderizarTodos();
    listagem.renderizaStatus();
    listagem.atualizarCards();

    // Busca em tempo real
    const inputBusca = document.getElementById("inputBusca");
    inputBusca.addEventListener("input", () => {
        const termo = inputBusca.value.trim();
        listagem.buscarColabs(termo);
    });

    const btn_baixarLista = document.getElementById("btnCsv")
    btn_baixarLista.addEventListener("click", () => {
    listagem.baixarNomesCSV(filtradosTab);
    });

    const btn_baixarLista_porCasa = document.getElementById("btnCsv2")
    btn_baixarLista_porCasa.addEventListener("click", () => {
    listagem.baixarNomesCSVPorCasa(filtradosTab);
    });
});