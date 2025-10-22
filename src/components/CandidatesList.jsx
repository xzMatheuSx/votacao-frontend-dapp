function CandidatesList({ candidatos, votacaoAtiva, jaVotou, onVotar, loading }) {
  return (
    <div className="candidatos">
      <h2>Candidatos</h2>
      {candidatos.length === 0 ? (
        <p>Nenhum candidato cadastrado.</p>
      ) : (
        <ul>
          {candidatos.map((cand, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{cand.nome} - {cand.votos} voto(s)</span>
              {votacaoAtiva && !jaVotou && (
                <button
                  onClick={() => onVotar(index)}
                  disabled={loading} 
                  className={`btn-votar ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
                >
                  {loading ? "Enviando..." : "Votar"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CandidatesList;
