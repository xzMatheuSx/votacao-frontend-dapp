function Results({ votacaoAtiva, vencedor, votosVencedor, totalCandidatos }) {
  if (votacaoAtiva || totalCandidatos === 0) return null;

  return (
    <div className="resultados">
      <h2>Resultado Final</h2>
      {vencedor ? (
        <p>Vencedor: {vencedor} com {votosVencedor} votos</p>
      ) : (
        <p>Aguardando resultados...</p>
      )}
    </div>
  );
}

export default Results;