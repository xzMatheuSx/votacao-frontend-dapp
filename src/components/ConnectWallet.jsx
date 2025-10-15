import { useState } from 'react';
import { ethers } from 'ethers';
import { contrato_endereco } from '../contract/AddressContract';
import contratoAbi from '../contract/AddressAbi.json';

function ConnectWallet({ onDataLoaded, onDisconnect }) {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask não detectado. Instale a extensão MetaMask.');
        return;
      }

      const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contrato = new ethers.Contract(contrato_endereco, contratoAbi, signer);

      setContract(contrato);
      setAccount(addr);
      setIsConnected(true);

      if (onDataLoaded) {
        await onDataLoaded(contrato, addr);
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      if (error.code === 4001) {
        alert('Conexão negada pelo usuário.');
      } else {
        alert('Erro ao conectar: ' + error.message);
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
      setAccount('');
      setContract(null);
      setIsConnected(false);
      if (onDisconnect) {
        onDisconnect();
      }
      console.log('Desconectado com sucesso.');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setAccount('');
      setContract(null);
      setIsConnected(false);
      if (onDisconnect) {
        onDisconnect();
      }
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