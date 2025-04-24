import { Keypair } from 'stellar-sdk';
// import Server from 'stellar-sdk';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export function createWallet() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const secretKey = Buffer.from(randomBytes).toString('hex');
  const publicKey = `G${secretKey.slice(0, 10).toUpperCase()}`; // fake example for now

  return {
    publicKey,
    secretKey,
  };
}


export async function saveWallet(wallet: { publicKey: string; secretKey: string }) {
  await SecureStore.setItemAsync('wallet', JSON.stringify(wallet));
}

export async function getWallet(): Promise<{ publicKey: string; secretKey: string } | null> {
  const walletData = await SecureStore.getItemAsync('wallet');
  return walletData ? JSON.parse(walletData) : null;
}

export async function fundTestnetWallet(publicKey: string) {
  try {
    const response = await axios.get(`https://friendbot.stellar.org?addr=${publicKey}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Funding failed: ' + error.message);
  }
}

export async function getWalletBalance(publicKey: string): Promise<string> {
  try {
    const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    const data = await response.json();
    const balance = data.balances.find((b: any) => b.asset_type === 'native');
    return balance?.balance || '0';
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    return '0';
  }
}
