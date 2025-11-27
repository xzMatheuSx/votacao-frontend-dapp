import { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import VotingStatus from './components/VotingStatus.jsx';
import CandidatesList from './components/CandidatesList.jsx';
import Results from './components/Results.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidatos, setCandidatos] = useState([]);
  const [totalCandidatos, setTotalCandidatos] = useState(0);
  const [votacaoAtiva, setVotacaoAtiva] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [vencedor, setVencedor] = useState('');
  const [votosVencedor, setVotosVencedor] = useState(0);
  const [jaVotou, setJaVotou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!contract) return;
    let interval;

    const fetchTempoBlockchain = async () => {
      try {
        const restante = await contract.tempoRestante();
        setTempoRestante(Number(restante));

        const ativa = await contract.estaAtiva();
        setVotacaoAtiva(ativa);
      } catch (err) {
        console.error('Erro ao buscar tempo na blockchain:', err);
      }
    };

    fetchTempoBlockchain();
    interval = setInterval(fetchTempoBlockchain, 1000);

    return () => clearInterval(interval);
  }, [contract]);

  //buscar resultado final quando votação termina
  useEffect(() => {
    const fetchResultado = async () => {
      if (!contract || votacaoAtiva) return;

      try {
        const [vencedorNome, votos] = await contract.resultadoFinal();
        setVencedor(vencedorNome);
        setVotosVencedor(votos.toString());

        //atualizar votos dos candidatos
        const total = await contract.obterTotalCandidatos();
        const candidatoList = [];
        for (let i = 0; i < Number(total); i++) {
          const cand = await contract.candidatos(i);
          candidatoList.push({ nome: cand.nome, votos: Number(cand.votos) });
        }
        setCandidatos(candidatoList);
      } catch (error) {
        console.error('Erro ao buscar resultado final:', error);
      }
    };

    fetchResultado();
  }, [contract, votacaoAtiva]);

  const loadContractData = async (addr, contratoInstancia = null) => {
    const contratoAtivo = contratoInstancia || contract;
    if (!contratoAtivo) return;

    try {
      setAccount(addr);

      const admin = await contratoAtivo.admin();
      setIsAdmin(admin.toLowerCase() === addr.toLowerCase());

      const total = await contratoAtivo.obterTotalCandidatos();
      setTotalCandidatos(Number(total));

      const candidatoList = [];
      for (let i = 0; i < Number(total); i++) {
        const cand = await contratoAtivo.candidatos(i);
        candidatoList.push({ nome: cand.nome, votos: Number(cand.votos) });
      }
      setCandidatos(candidatoList);

      const ativa = await contratoAtivo.estaAtiva();
      setVotacaoAtiva(ativa);

      const eleitor = await contratoAtivo.eleitores(addr);
      setJaVotou(eleitor.votou);

      if (!ativa) {
        try {
          const [vencedorNome, votos] = await contratoAtivo.resultadoFinal();
          setVencedor(vencedorNome);
          setVotosVencedor(votos.toString());
        } catch (error) {
          console.error('Erro ao buscar resultado final:', error);
        }
      }

      const tempo = await contratoAtivo.tempoRestante();
      setTempoRestante(Number(tempo));

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAdicionarCandidato = async (nome) => {
    if (!contract || !nome) return;
    try {
      const tx = await contract.adicionarCandidato(nome);
      await tx.wait();
      alert('Candidato adicionado!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleIniciarVotacao = async (duracao) => {
    try {
      const tx = await contract.iniciarVotacao(duracao);
      await tx.wait();
      alert('Votação iniciada!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleVotar = async (indice) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.votar(indice);
      await tx.wait();
      setLoading(false);
      alert('Voto registrado!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaVotacao = async () => {
    if (!contract) return;
    try {
      const tx = await contract.novaVotacao();
      await tx.wait();
      alert('Nova votação iniciada!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setContract(null);
    setIsAdmin(false);
    setCandidatos([]);
    setTotalCandidatos(0);
    setVotacaoAtiva(false);
    setTempoRestante(0);
    setVencedor('');
    setVotosVencedor(0);
    setJaVotou(false);
  };

  const formatTempo = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={isDarkMode ? 'min-h-screen py-8 px-4' : 'min-h-screen py-8 px-4 bg-light-bg'}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-white"
            title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDarkMode ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
                <span>Claro</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Escuro</span>
              </>
            )}
          </button>
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ${isDarkMode ? '' : 'drop-shadow-sm'}`}>
          Sistema de Votação em Blockchain
        </h1>

        <div className="mb-6">
          <ConnectWallet
            onContractReady={setContract}
            onDataLoaded={loadContractData}
            onDisconnect={handleDisconnect}
            isDarkMode={isDarkMode}
          />
        </div>

        {account && (
          <div className="space-y-6">
            {isAdmin && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Você é o Admin
                </p>
              </div>
            )}

            {isAdmin && (
              <AdminPanel
                votacaoAtiva={votacaoAtiva}
                totalCandidatos={totalCandidatos}
                onAdicionarCandidato={handleAdicionarCandidato}
                onIniciarVotacao={handleIniciarVotacao}
                onNovaVotacao={handleNovaVotacao}
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
                  onVotar={handleVotar}
                  loading={loading}
                  isDarkMode={isDarkMode}
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
