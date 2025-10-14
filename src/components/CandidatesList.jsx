function CandidatesList({ candidatos, votacaoAtiva, jaVotou, onVotar }) {
  return (
    <div className="candidatos">
      <h2>Candidatos</h2>
      {candidatos.length === 0 ? (
        <p>Nenhum candidato cadastrado.</p>
      ) : (
        <ul>
          {candidatos.map((cand, index) => (
            <li key={index}>
              <span>{cand.nome} - {cand.votos} voto(s)</span>
              {votacaoAtiva && !jaVotou && (
                <button onClick={() => onVotar(index)} className="btn-votar">Votar</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CandidatesList;