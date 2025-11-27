import { useState } from 'react';
import { ethers } from 'ethers';
import { contrato_endereco } from '../contract/AddressContract';
import contratoAbi from '../contract/AddressAbi.json';
import metamaskIcon from '../image/metamask.png';

function ConnectWallet({ onContractReady, onDataLoaded, onDisconnect, isDarkMode }) {
  const [account, setAccount] = useState('');
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

      setAccount(addr);
      setIsConnected(true);

      if (onContractReady) onContractReady(contrato);  // seta o contract no estado do App
      if (onDataLoaded) await onDataLoaded(addr, contrato);  // passa a instancia do contrato

    } catch (error) {
      console.error('Erro ao conectar:', error);
      if (error.code === 4001) alert('Conexão negada pelo usuário.');
      else alert('Erro ao conectar: ' + error.message);
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
      setIsConnected(false);
      if (onDisconnect) onDisconnect();
      console.log('Desconectado com sucesso.');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setAccount('');
      setIsConnected(false);
      if (onDisconnect) onDisconnect();
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={isDarkMode ? 'card-dark' : 'card-light'}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center p-2">
            <img src={metamaskIcon} alt="MetaMask" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Carteira MetaMask</h2>
            <p className={`text-sm ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'}`}>
              {isConnected ? 'Conectado e pronto para votar' : 'Conecte para interagir com o contrato'}
            </p>
          </div>
        </div>

        {!isConnected ? (
          <button onClick={connectWallet} className="btn-warning flex items-center gap-2">
            <img src={metamaskIcon} alt="MetaMask" className="w-5 h-5" />
            Conectar Carteira
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-mono">
              {truncateAddress(account)}
            </span>
            <button onClick={disconnectWallet} className="btn-secondary text-sm">
              Desconectar
            </button>
          </div>
        )}
      </div>
      <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-center`}>
        <p className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Contrato: {contrato_endereco}
        </p>
      </div>
    </div>
  );
}

export default ConnectWallet;
