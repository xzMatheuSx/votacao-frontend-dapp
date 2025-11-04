function Results({ votacaoAtiva, vencedor, votosVencedor, totalCandidatos, isDarkMode }) {
  if (votacaoAtiva || totalCandidatos === 0) return null;

  return (
    <div className={`border-2 border-yellow-500/30 ${isDarkMode ? 'card-dark' : 'card-light'}`}>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Resultado Final</h2>
      </div>

      <div className="text-center py-8">
        {vencedor ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
              <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm uppercase tracking-wider mb-2 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>Vencedor</p>
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">
                {vencedor}
              </h3>
              <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                Total de <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{votosVencedor}</span> voto(s)
              </p>
            </div>
          </div>
        ) : (
          <div className={`py-4 ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Aguardando resultados...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;