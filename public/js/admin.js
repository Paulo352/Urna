class AdminPanel {
    constructor() {
        this.resultsContainer = document.getElementById('results-display');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('show-results').addEventListener('click', async () => {
            await this.showResults();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('reset-votes').addEventListener('click', () => {
            if (confirm("Tem certeza que deseja zerar todos os votos?")) {
                localStorage.removeItem('votes');
                this.resultsContainer.innerHTML = '<p>Urna zerada com sucesso.</p>';
            }
        });
    }

    async showResults() {
        const votes = JSON.parse(localStorage.getItem('votes') || '[]');
        const votingSystem = new VotingSystem();
        
        const results = {};
        let totalVotes = 0;
        
        for (const vote of votes) {
            const encryptedVote = new Uint8Array(vote);
            const decrypted = await CryptoUtils.decryptVote(
                encryptedVote, 
                votingSystem.keyPair.privateKey
            );
            
            if (decrypted) {
                const candidate = decrypted.candidate;
                results[candidate] = (results[candidate] || 0) + 1;
                totalVotes++;
            }
        }
        
        this.displayResults(results, totalVotes);
    }

    displayResults(results, totalVotes) {
        let html = '<h2>Resultados Parciais</h2>';
        html += `<p>Total de votos: ${totalVotes}</p>`;
        html += '<table><tr><th>Candidato</th><th>Votos</th><th>%</th></tr>';
        
        for (const [number, votes] of Object.entries(results)) {
            const candidate = new VotingSystem().candidates[number] || { 
                name: 'Nulo/Inválido', 
                party: '' 
            };
            
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : 0;
            
            html += `
                <tr>
                    <td>${number} - ${candidate.name} (${candidate.party})</td>
                    <td>${votes}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }
        
        html += '</table>';
        this.resultsContainer.innerHTML = html;
    }

    exportData() {
        const votes = localStorage.getItem('votes');
        if (!votes) {
            alert("Nenhum voto para exportar!");
            return;
        }
        
        const blob = new Blob([votes], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `urna-data-${new Date().toISOString()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Inicializa o painel de admin quando a tela estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-screen')) {
        new AdminPanel();
    }
});