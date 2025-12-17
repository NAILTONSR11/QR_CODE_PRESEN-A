const baseURL = window.location.origin; // pega http://localhost:3000 ou https://seuapp.onrender.com

const api = {
    async listarT() {
        try {
            const res = await fetch(`${baseURL}/user`);
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao listar Pessoas!", error);
            throw error;
        }
    },

    async cadastrarUser(dados) {
        try {
            const res = await fetch(`${baseURL}/user`, {
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
            const res = await fetch(`${baseURL}/user/all`, {
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
            const res = await fetch(`${baseURL}/user/all`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            return await res.json();
        } catch (error) {
            console.error("API - Erro ao excluir todos os colaboradores!", error);
            throw error;
        }
    },

    async atualizaStatus(id, dados) {
        try {
            const res = await fetch(`${baseURL}/user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            return await res.json();
        } catch (error) {
            console.error("Erro na API ao atualizar status:", error);
            return { error: true };
        }
    },

    async buscarColaborador(matricula) {
        const res = await fetch(`${baseURL}/user/${matricula}`);
        return res.json();
    }
};

export default api;
