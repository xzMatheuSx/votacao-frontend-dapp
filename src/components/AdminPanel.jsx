import { useState } from 'react';

function AdminPanel({ votacaoAtiva, totalCandidatos, onAdicionarCandidato, onIniciarVotacao, onNovaVotacao, isDarkMode }) {
  const [newCandidateName, setNewCandidateName] = useState('');
  const [duracaoVotacao, setDuracaoVotacao] = useState('');

  const handleAdicionar = () => {
    onAdicionarCandidato(newCandidateName);
    setNewCandidateName('');
  };

  const handleIniciar = () => {
    const duracaoSegundos = parseInt(duracaoVotacao) * 60;
    onIniciarVotacao(duracaoSegundos);
    setDuracaoVotacao('');
  };

  const handleNova = () => {
    onNovaVotacao();
  };

  if (votacaoAtiva) return null;

  return (
    <div className={isDarkMode ? 'card-dark' : 'card-light'}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Painel Admin
        </h2>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
          {totalCandidatos} candidato(s)
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className={isDarkMode ? 'input-dark flex-1' : 'input-light flex-1'}
            placeholder="Nome do Candidato"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
          />
          <button onClick={handleAdicionar} className="btn-primary whitespace-nowrap">
            Adicionar Candidato
          </button>
        </div>

        {totalCandidatos === 0 ? (
          <p className={`text-center py-4 italic ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
            Nenhum candidato. Adicione para iniciar votação.
          </p>
        ) : (
          <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}>
            <input
              type="number"
              className={isDarkMode ? 'input-dark flex-1' : 'input-light flex-1'}
              placeholder="Duração em minutos"
              value={duracaoVotacao}
              onChange={(e) => setDuracaoVotacao(e.target.value)}
              min="1"
            />
            <button onClick={handleIniciar} className="btn-success whitespace-nowrap">
              Iniciar Votação
            </button>
          </div>
        )}

        <button onClick={handleNova} className="btn-danger w-full">
          Nova Votação (Reset)
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;