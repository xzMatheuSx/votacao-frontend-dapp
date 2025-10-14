import { ethers } from 'ethers';
import { contrato_endereco } from '../contract/AddressContract';
import contratoAbi from '../contract/AddressAbi.json';

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask não detectado. Instale a extensão MetaMask.');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Verifica se já há contas conectadas
  let accounts = await provider.listAccounts();
  console.log('Contas autorizadas:', accounts.length); // Debug: Veja no console (F12)
  
  if (accounts.length === 0) {
    console.log('Nenhuma conta autorizada. Abrindo pop-up...'); // Debug
    // Só solicita se não houver contas conectadas (evita pop-up desnecessário)
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await provider.listAccounts(); // Atualiza a lista após solicitação
  }
  
  if (accounts.length === 0) {
    throw new Error('Nenhuma conta conectada. Conecte uma conta no MetaMask.');
  }
  
  const signer = await provider.getSigner();
  const contrato = new ethers.Contract(contrato_endereco, contratoAbi, signer);
  return contrato;
};