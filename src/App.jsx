import { useState, useEffect } from 'react'
import AdminPanel from './components/AdminPanel.jsx'
import VotingStatus from './components/VotingStatus.jsx'
import CandidatesList from './components/CandidatesList.jsx'
import Results from './components/Results.jsx'
import ConnectWallet from './components/ConnectWallet.jsx'
import './App.css'

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

  useEffect(() => {
    const timer = setInterval(() => {
      if (contract) {
        updateTempoRestante();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [contract]);

  const loadContractData = async (cont, addr) => {
    try {
      const admin = await cont.admin();
      setIsAdmin(admin.toLowerCase() === addr.toLowerCase());
      setAccount(addr);
      setContract(cont);

      const total = await cont.obterTotalCandidatos();
      setTotalCandidatos(Number(total));
      const candidato = [];
      for (let i = 0; i < Number(total); i++) {
        const cand = await cont.candidatos(i);
        candidato.push({ nome: cand.nome, votos: cand.votos.toString() });
      }
      setCandidatos(candidato);

      const ativa = await cont.estaAtiva();
      setVotacaoAtiva(ativa);

      const eleitor = await cont.eleitores(addr);
      setJaVotou(eleitor.votou);

      if (!ativa) {
        try {
          const [vencedorNome, votos] = await cont.resultadoFinal();
          setVencedor(vencedorNome);
          setVotosVencedor(votos.toString());
        } catch (e) {
          // Votação não finalizada ainda
        }
      }

      await updateTempoRestante();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const updateTempoRestante = async () => {
    if (contract) {
      const tempo = await contract.tempoRestante();
      setTempoRestante(Number(tempo));
      const ativa = await contract.estaAtiva();
      setVotacaoAtiva(ativa);
    }
  };

  const handleAdicionarCandidato = async (nome) => {
    if (!contract || !nome) return;
    try {
      const tx = await contract.adicionarCandidato(nome);
      await tx.wait();
      alert('Candidato adicionado!');
      loadContractData(contract, account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleIniciarVotacao = async (duracao) => {
    if (!contract || !duracao) return;
    try {
      const tx = await contract.iniciarVotacao(BigInt(duracao));
      await tx.wait();
      alert('Votação iniciada!');
      loadContractData(contract, account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleVotar = async (indice) => {
    if (!contract) return;
    try {
      const tx = await contract.votar(BigInt(indice));
      await tx.wait();
      alert('Voto registrado!');
      loadContractData(contract, account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleNovaVotacao = async () => {
    if (!contract) return;
    try {
      const tx = await contract.novaVotacao();
      await tx.wait();
      alert('Nova votação iniciada!');
      loadContractData(contract, account);
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
      <h1>Sistema de Votação Blockchain</h1>
      <ConnectWallet onDataLoaded={loadContractData} />
      {account && (
        <>
          <p>Conta: {account}</p>
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
          />

          <Results
            votacaoAtiva={votacaoAtiva}
            vencedor={vencedor}
            votosVencedor={votosVencedor}
            totalCandidatos={totalCandidatos}
          />

          {jaVotou && votacaoAtiva && <p className="aviso-voto">Você já votou!</p>}
        </>
      )}
    </div>
  );
}

export default App;