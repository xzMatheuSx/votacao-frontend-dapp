import { useState, useEffect, useCallback } from 'react';

const fetchCandidatos = async (contract) => {
  const total = await contract.obterTotalCandidatos();
  const lista = [];
  for (let i = 0; i < Number(total); i++) {
    const cand = await contract.candidatos(i);
    lista.push({ nome: cand.nome, votos: Number(cand.votos) });
  }
  return { total: Number(total), lista };
};

export function useVotacao(contract, account) {
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

    const fetchTempoBlockchain = async () => {
      try {
        const [restante, ativa] = await Promise.all([
          contract.tempoRestante(),
          contract.estaAtiva()
        ]);
        setTempoRestante(Number(restante));
        setVotacaoAtiva(ativa);
      } catch (err) {
        console.error('Erro ao buscar tempo na blockchain:', err);
      }
    };

    fetchTempoBlockchain();
    const interval = setInterval(fetchTempoBlockchain, 9000);
    return () => clearInterval(interval);
  }, [contract]);

  //listeners de eventos da blockchain
  useEffect(() => {
    if (!contract || !account) return;

    const atualizarCandidatos = async () => {
      try {
        const { total, lista } = await fetchCandidatos(contract);
        setTotalCandidatos(total);
        setCandidatos(lista);
      } catch (error) {
        console.error('Erro ao atualizar candidatos:', error);
      }
    };

    const handleVotoRegistrado = () => {
      console.log('Evento: Voto registrado');
      atualizarCandidatos();
    };

    const handleVotacaoIniciada = async () => {
      console.log('Evento: Votação iniciada');
      setVotacaoAtiva(true);
      setVencedor('');
      setVotosVencedor(0);
      const tempo = await contract.tempoRestante();
      setTempoRestante(Number(tempo));
    };

    const handleVotacaoFinalizada = async () => {
      console.log('Evento: Votação finalizada');
      setVotacaoAtiva(false);
      try {
        const [vencedorNome, votos] = await contract.resultadoFinal();
        setVencedor(vencedorNome);
        setVotosVencedor(votos.toString());
      } catch (error) {
        console.error('Erro ao buscar resultado:', error);
      }
    };

    const handleCandidatoAdicionado = () => {
      console.log('Evento: Candidato adicionado');
      atualizarCandidatos();
    };

    const handleNovaVotacao = () => {
      console.log('Evento: Nova votação iniciada');
      setVotacaoAtiva(false);
      setVencedor('');
      setVotosVencedor(0);
      setJaVotou(false);
      atualizarCandidatos();
    };

    //registrar os eventos
    contract.on('VotoRegistrado', handleVotoRegistrado);
    contract.on('VotacaoIniciada', handleVotacaoIniciada);
    contract.on('VotacaoFinalizada', handleVotacaoFinalizada);
    contract.on('CandidatoAdicionado', handleCandidatoAdicionado);
    contract.on('NovaVotacaoIniciada', handleNovaVotacao);

    return () => {
      contract.off('VotoRegistrado', handleVotoRegistrado);
      contract.off('VotacaoIniciada', handleVotacaoIniciada);
      contract.off('VotacaoFinalizada', handleVotacaoFinalizada);
      contract.off('CandidatoAdicionado', handleCandidatoAdicionado);
      contract.off('NovaVotacaoIniciada', handleNovaVotacao);
    };
  }, [contract, account]);

  
  useEffect(() => {
    if (!contract || votacaoAtiva) return;

    const fetchResultado = async () => {
      try {
        const [vencedorNome, votos] = await contract.resultadoFinal();
        setVencedor(vencedorNome);
        setVotosVencedor(votos.toString());

        const { lista } = await fetchCandidatos(contract);
        setCandidatos(lista);
      } catch (error) {
        console.error('Erro ao buscar resultado final:', error);
      }
    };

    fetchResultado();
  }, [contract, votacaoAtiva]);

  
  const loadContractData = useCallback(async (addr, contratoInstancia ) => {
    const contratoAtivo = contratoInstancia || contract;
    if (!contratoAtivo) return;

    try {
      const [admin, { total, lista }, ativa, eleitor, tempo] = await Promise.all([
        contratoAtivo.admin(),
        fetchCandidatos(contratoAtivo),
        contratoAtivo.estaAtiva(),
        contratoAtivo.eleitores(addr),
        contratoAtivo.tempoRestante()
      ]);

      setIsAdmin(admin.toLowerCase() === addr.toLowerCase());
      setTotalCandidatos(total);
      setCandidatos(lista);
      setVotacaoAtiva(ativa);
      setJaVotou(eleitor.votou);
      setTempoRestante(Number(tempo));

      if (!ativa) {
        try {
          const [vencedorNome, votos] = await contratoAtivo.resultadoFinal();
          setVencedor(vencedorNome);
          setVotosVencedor(votos.toString());
        } catch (error) {
          console.error('Erro ao buscar resultado final:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }, [contract]);

  //reset dos dados
  const resetData = useCallback(() => {
    setIsAdmin(false);
    setCandidatos([]);
    setTotalCandidatos(0);
    setVotacaoAtiva(false);
    setTempoRestante(0);
    setVencedor('');
    setVotosVencedor(0);
    setJaVotou(false);
  }, []);

  
  const adicionarCandidato = useCallback(async (nome) => {
    if (!contract || !nome) return;
    try {
      const tx = await contract.adicionarCandidato(nome);
      await tx.wait();
      alert('Candidato adicionado!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }, [contract, account, loadContractData]);

  const iniciarVotacao = useCallback(async (duracao) => {
    if (!contract) return;
    try {
      const tx = await contract.iniciarVotacao(duracao);
      await tx.wait();
      alert('Votação iniciada!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }, [contract, account, loadContractData]);

  const votar = useCallback(async (indice) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.votar(indice);
      await tx.wait();
      alert('Voto registrado!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [contract, account, loadContractData]);

  const novaVotacao = useCallback(async () => {
    if (!contract) return;
    try {
      const tx = await contract.novaVotacao();
      await tx.wait();
      alert('Nova votação iniciada!');
      loadContractData(account);
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }, [contract, account, loadContractData]);

  return {
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
  };
}
