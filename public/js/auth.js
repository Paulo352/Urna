class AuthService {
    static async authenticate(username, password) {
        // Simulação de requisição ao backend
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === "mesario" && password === "SenhaSegura123") {
                    localStorage.setItem('authToken', 'simulated-token-123');
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    }

    static isAuthenticated() {
        return localStorage.getItem('authToken') !== null;
    }

    static logout() {
        localStorage.removeItem('authToken');
    }

    static isAdmin() {
        // Verificação simplificada
        return localStorage.getItem('authToken') === 'simulated-token-123';
    }
}