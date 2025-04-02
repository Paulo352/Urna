class VotingSystem {
    constructor() {
        this.candidates = {
            '13': { name: 'Lula', party: 'PT', position: 'Presidente' },
            '22': { name: 'Bolsonaro', party: 'PL', position: 'Presidente' },
            '15': { name: 'Simone Tebet', party: 'MDB', position: 'Presidente' },
            '12': { name: 'Ciro Gomes', party: 'PDT', position: 'Presidente' }
        };
        
        this.currentVote = '';
        this.keyPair = null;
        
        this.initKeyPair();
        this.setupEventListeners();
    }

    async initKeyPair() {
        try {
            this.keyPair = await CryptoUtils.generateKeyPair();
        } catch (error) {
            console.error("Error generating key pair:", error);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.keys button[data-number]').forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.currentVote.length < 2) {
                    this.currentVote += e.target.dataset.number;
                    this.updateDisplay();
                }
            });
        });

        document.getElementById('corrige').addEventListener('click', () => {
            this.currentVote = '';
            this.updateDisplay();
        });

        document.getElementById('confirma').addEventListener('click', async () => {
            await this.submitVote();
        });
    }

    updateDisplay() {
        const display = document.getElementById('vote-input');
        display.value = this.currentVote;
        
        const candidateDisplay = document.getElementById('candidate-display');
        if (this.currentVote.length === 2) {
            const candidate = this.candidates[this.currentVote];
            if (candidate) {
                candidateDisplay.innerHTML = `
                    <h3>${candidate.position}</h3>
                    <p>${candidate.name} - ${candidate.party}</p>
                `;
            } else {
                candidateDisplay.innerHTML = `
                    <h3>Voto Nulo</h3>
                    <p>Número ${this.currentVote} não encontrado</p>
                `;
            }
        } else {
            candidateDisplay.innerHTML = '';
        }
    }

    async submitVote() {
        if (!this.currentVote) return;
        
        const voterId = prompt("Digite seu título de eleitor:");
        if (!voterId) return;
        
        const voteData = {
            candidate: this.currentVote,
            voterId: await CryptoUtils.hashVoterId(voterId),
            timestamp: new Date().toISOString()
        };
        
        try {
            const encryptedVote = await CryptoUtils.encryptVote(voteData, this.keyPair.publicKey);
            await this.saveVote(encryptedVote);
            
            alert("Voto registrado com sucesso!");
            this.currentVote = '';
            this.updateDisplay();
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert("Erro ao registrar voto!");
        }
    }

    async saveVote(encryptedVote) {
        // Simulação de envio para o backend
        const votes = JSON.parse(localStorage.getItem('votes') || '[]');
        votes.push(Array.from(new Uint8Array(encryptedVote)));
        localStorage.setItem('votes', JSON.stringify(votes));
    }
}

// Inicializa o sistema de votação quando a tela estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('voting-screen')) {
        new VotingSystem();
    }
});