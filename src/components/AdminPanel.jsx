import { useState } from 'react';

function AdminPanel({ votacaoAtiva, totalCandidatos, onAdicionarCandidato, onIniciarVotacao, onNovaVotacao }) {
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
    <div className="admin-panel">
      <h2>Painel Admin</h2>
      <div className="admin-section">
        <input
          type="text"
          placeholder="Nome do Candidato"
          value={newCandidateName}
          onChange={(e) => setNewCandidateName(e.target.value)}
        />
        <button onClick={handleAdicionar}>Adicionar Candidato</button>
      </div>
      {totalCandidatos === 0 ? (
        <p>Nenhum candidato. Adicione para iniciar votação.</p>
      ) : (
        <div className="admin-section">
          <input
            type="number"
            placeholder="Duração em minutos"
            value={duracaoVotacao}
            onChange={(e) => setDuracaoVotacao(e.target.value)}
          />
          <button onClick={handleIniciar}>Iniciar Votação</button>
        </div>
      )}
      <button onClick={handleNova} className="btn-reset">Nova Votação (Reset)</button>
    </div>
  );
}

export default AdminPanel;