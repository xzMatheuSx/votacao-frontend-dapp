function VotingStatus({ votacaoAtiva, tempoRestante, formatTempo, isDarkMode }) {
  return (
    <div className={isDarkMode ? 'card-dark h-full' : 'card-light h-full'}>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Status da Votação</h2>
      </div>

      <div className="text-center space-y-4">
        <div>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>Status</p>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
            votacaoAtiva 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              votacaoAtiva ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></span>
            {votacaoAtiva ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        {votacaoAtiva && (
          <div>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>Tempo Restante</p>
            <div className="text-4xl md:text-5xl font-bold text-yellow-400 font-mono">
              {formatTempo(Math.max(tempoRestante, 0))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VotingStatus;