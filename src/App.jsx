import { useState } from 'react';
import { useVotacao } from './hooks/useVotacao';
import { formatTempo } from './utils/formatters';
import { ThemeToggle, AdminBadge, PageTitle } from './components/UI';
import AdminPanel from './components/AdminPanel';
import VotingStatus from './components/VotingStatus';
import CandidatesList from './components/CandidatesList';
import Results from './components/Results';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const {
    isAdmin,
    candidatos,
    totalCandidatos,
    votacaoAtiva,
    tempoRestante,
    vencedor,
    votosVencedor,
    jaVotou,
    loading,
    loadContractData,
    resetData,
    adicionarCandidato,
    iniciarVotacao,
    votar,
    novaVotacao,
  } = useVotacao(contract, account);

  const handleDisconnect = () => {
    setAccount('');
    setContract(null);
    resetData();
  };

  const handleDataLoaded = (addr, contratoInstancia) => {
    setAccount(addr);
    loadContractData(addr, contratoInstancia);
  };

  return (
    <div className={isDarkMode ? 'min-h-screen py-8 px-4' : 'min-h-screen py-8 px-4 bg-light-bg'}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={() => setIsDarkMode(!isDarkMode)} 
          />
        </div>

        <PageTitle isDarkMode={isDarkMode} />

        <div className="mb-6">
          <ConnectWallet
            onContractReady={setContract}
            onDataLoaded={handleDataLoaded}
            onDisconnect={handleDisconnect}
            isDarkMode={isDarkMode}
          />
        </div>

        {account && (
          <div className="space-y-6">
            {isAdmin && <AdminBadge />}

            {isAdmin && (
              <AdminPanel
                votacaoAtiva={votacaoAtiva}
                totalCandidatos={totalCandidatos}
                onAdicionarCandidato={adicionarCandidato}
                onIniciarVotacao={iniciarVotacao}
                onNovaVotacao={novaVotacao}
                isDarkMode={isDarkMode}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <VotingStatus
                  votacaoAtiva={votacaoAtiva}
                  tempoRestante={tempoRestante}
                  formatTempo={formatTempo}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="lg:col-span-2">
                <CandidatesList
                  candidatos={candidatos}
                  votacaoAtiva={votacaoAtiva}
                  jaVotou={jaVotou}
                  onVotar={votar}
                  loading={loading}
                  isDarkMode={isDarkMode}
                  votacaoEncerrada={!votacaoAtiva && vencedor !== ''}
                />
              </div>
            </div>

            <Results
              votacaoAtiva={votacaoAtiva}
              vencedor={vencedor}
              votosVencedor={votosVencedor}
              totalCandidatos={totalCandidatos}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
