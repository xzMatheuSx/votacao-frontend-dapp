import { ethers } from 'ethers';
import { contrato_endereco } from '../contract/AddressContract';
import contratoAbi from '../contract/AddressAbi.json';

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask não detectado. Instale a extensão MetaMask.');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);                                         
  let accounts = await provider.listAccounts();
  
  if (accounts.length === 0) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await provider.listAccounts(); 
  }
  
  if (accounts.length === 0) {
    throw new Error('Nenhuma conta conectada. Conecte uma conta no MetaMask.');
  }
  
  const signer = await provider.getSigner();
  const contrato = new ethers.Contract(contrato_endereco, contratoAbi, signer);
  return contrato;
};