function VotingStatus({ votacaoAtiva, tempoRestante, formatTempo }) {
  return (
    <div className="voting-status">
      <h2>Status da Votação</h2>
      <p>Votação Ativa: {votacaoAtiva ? 'Sim' : 'Não'}</p>
      {votacaoAtiva && tempoRestante > 0 && <p>Tempo Restante: {formatTempo(tempoRestante)}</p>}
    </div>
  );
}

export default VotingStatus;