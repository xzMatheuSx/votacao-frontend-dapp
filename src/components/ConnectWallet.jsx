import { useState, useEffect } from 'react';
import { getContract } from '../utils/contract';

function ConnectWallet({ onDataLoaded }) {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    
  }, []);

  const connectWallet = async () => {
    try {
      const cont = await getContract();
      const addr = await cont.runner.getAddress();  // Use 'runner' em ethers v6 para o signer do contrato
      setContract(cont);
      setAccount(addr);
      setIsConnected(true);
      if (onDataLoaded) {
        await onDataLoaded(cont, addr);
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      if (error.message.includes('MetaMask')) {
        alert(error.message);
      } else if (error.message.includes('User denied')) {
        alert('Conexão negada pelo usuário.');
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      setAccount('');
      setContract(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  return (
    <div className="web3-connector">
      {!isConnected ? (
        <button onClick={connectWallet} className="btn-connect">
          Conectar Carteira
        </button>
      ) : (
        <div className="connection-status">
          <p>Conta: {account}</p>
          <button onClick={disconnectWallet} className="btn-disconnect">
            Desconectar
          </button>
        </div>
      )}
      {contract && <p>Contrato conectado: {contract.target}</p>}
    </div>
  );
}

export default ConnectWallet;