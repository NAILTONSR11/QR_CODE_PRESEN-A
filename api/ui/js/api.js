/* const API_URL = "http://localhost:3000/api/user"; */

const api = {
    async listarT() {
        try {
            const res = await fetch("http://localhost:3000/user");
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao listar Pessoas!", error);
            throw error;
        }
    },

    async cadastrarUser(dados) {
        try {
                const res = await fetch("http://localhost:3000/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao salvar colaborador!", error);
            throw error;
        }
    },

    async cadastrarUserall(dados) {
        try {
                const res = await fetch("http://localhost:3000/user/all", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao salvar colaboradores!", error);
            throw error;
        }
    },

    async excluirTodosUsuarios() {
        try {
            const res = await fetch("http://localhost:3000/user/all", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" } // opcional, mas não faz mal
            });
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao excluir todos os colaboradores!", error);
            throw error;
        }
    },

/*     async buscarColaborador(matricula) {
        try {
            const res = await fetch(`http://localhost:3000/api/user?matricula=${matricula}`);
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao buscar colaborador!", error);
            throw error;
        }
    }, */

    async atualizaStatus(id, dados) {
        try {
            const res = await fetch(`http://localhost:3000/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            return await res.json();
        } catch (error) {
            console.error("Erro na API ao atualizar status:", error);
            return { error: true };
        }
    },

    async buscarColaborador(matricula) {
    return fetch(`http://localhost:3000/user/${matricula}`)
    .then(res => res.json());
}

};

export default api;
