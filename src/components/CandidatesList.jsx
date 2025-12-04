function CandidatesList({ candidatos, votacaoAtiva, jaVotou, onVotar, loading, isDarkMode, votacaoEncerrada }) {
  // Se votacaoAtiva é false e votacaoEncerrada é true, então a votação foi encerrada
  // Se votacaoAtiva é false e votacaoEncerrada é false, então a votação ainda não foi iniciada
  const getStatusLabel = () => {
    if (votacaoAtiva) return null;
    return votacaoEncerrada ? 'Votação encerrada' : 'Aguardando início';
  };

  return (
    <div className={isDarkMode ? 'card-dark h-full' : 'card-light h-full'}>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Candidatos</h2>
      </div>

      {candidatos.length === 0 ? (
        <p className={`text-center py-8 italic ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
          Nenhum candidato cadastrado.
        </p>
      ) : (
        <div className="space-y-3">
          {candidatos.map((cand, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-dark-bg border border-dark-border' 
                  : 'bg-gray-50 border border-light-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cand.nome}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
                    {cand.votos} voto(s)
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  {votacaoAtiva ? (
                    !jaVotou ? (
                      <button
                        onClick={() => onVotar(index)}
                        disabled={loading}
                        className="btn-success w-full sm:w-auto flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Votar
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Votado
                      </span>
                    )
                  ) : (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                      votacaoEncerrada 
                        ? 'bg-gray-500/20 text-gray-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {getStatusLabel()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidatesList;
