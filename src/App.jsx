import { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import VotingStatus from './components/VotingStatus.jsx';
import CandidatesList from './components/CandidatesList.jsx';
import Results from './components/Results.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import './App.css';

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
    interval = setInterval(fetchTempoBlockchain, 100);

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

  const loadContractData = async (addr) => {
    if (!contract) return;

    try {
      setAccount(addr);

      const admin = await contract.admin();
      setIsAdmin(admin.toLowerCase() === addr.toLowerCase());

      const total = await contract.obterTotalCandidatos();
      setTotalCandidatos(Number(total));

      const candidatoList = [];
      for (let i = 0; i < Number(total); i++) {
        const cand = await contract.candidatos(i);
        candidatoList.push({ nome: cand.nome, votos: Number(cand.votos) });
      }
      setCandidatos(candidatoList);

      const ativa = await contract.estaAtiva();
      setVotacaoAtiva(ativa);

      const eleitor = await contract.eleitores(addr);
      setJaVotou(eleitor.votou);

      if (!ativa) {
        try {
          const [vencedorNome, votos] = await contract.resultadoFinal();
          setVencedor(vencedorNome);
          setVotosVencedor(votos.toString());
        } catch (error) {
          console.error('Erro ao buscar resultado final:', error);
        }
      }

      const tempo = await contract.tempoRestante();
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

  const formatTempo = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <h1>Sistema de Votação em Blockchain</h1>

      <ConnectWallet
        onContractReady={setContract}
        onDataLoaded={loadContractData}
      />

      {account && (
        <>
          {isAdmin && <p><strong>Você é o Admin</strong></p>}
          <hr />

          {isAdmin && (
            <AdminPanel
              votacaoAtiva={votacaoAtiva}
              totalCandidatos={totalCandidatos}
              onAdicionarCandidato={handleAdicionarCandidato}
              onIniciarVotacao={handleIniciarVotacao}
              onNovaVotacao={handleNovaVotacao}
            />
          )}

          <VotingStatus
            votacaoAtiva={votacaoAtiva}
            tempoRestante={tempoRestante}
            formatTempo={formatTempo}
          />

          <CandidatesList
            candidatos={candidatos}
            votacaoAtiva={votacaoAtiva}
            jaVotou={jaVotou}
            onVotar={handleVotar}
            loading={loading}
          />

          <Results
            votacaoAtiva={votacaoAtiva}
            vencedor={vencedor}
            votosVencedor={votosVencedor}
            totalCandidatos={totalCandidatos}
          />
        </>
      )}
    </div>
  );
}

export default App;
