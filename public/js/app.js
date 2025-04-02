class UrnaEletronicaApp {
    constructor() {
        this.currentScreen = 'auth';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupAuthForm();
        this.setupNavigation();
    }

    checkAuth() {
        if (AuthService.isAuthenticated()) {
            if (AuthService.isAdmin()) {
                this.showScreen('admin');
            } else {
                this.showScreen('voting');
            }
        } else {
            this.showScreen('auth');
        }
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        document.getElementById(`${screenName}-screen`).classList.remove('hidden');
        this.currentScreen = screenName;
    }

    setupAuthForm() {
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                const isAuthenticated = await AuthService.authenticate(username, password);
                if (isAuthenticated) {
                    this.checkAuth();
                } else {
                    alert("Credenciais inválidas!");
                }
            });
        }
    }

    setupNavigation() {
        // Botão de logout pode ser adicionado no HTML
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                AuthService.logout();
                this.showScreen('auth');
            });
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new UrnaEletronicaApp();
});