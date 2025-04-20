import AsyncStorage from '@react-native-async-storage/async-storage';

const TX_KEY = 'scheduled_transactions';

export const saveScheduledTransaction = async (tx: any) => {
  const existing = await AsyncStorage.getItem(TX_KEY);
  const parsed = existing ? JSON.parse(existing) : [];
  parsed.push(tx);
  await AsyncStorage.setItem(TX_KEY, JSON.stringify(parsed));
};

export const getScheduledTransactions = async () => {
  const txs = await AsyncStorage.getItem(TX_KEY);
  return txs ? JSON.parse(txs) : [];
};

export const clearScheduledTransactions = async () => {
  await AsyncStorage.removeItem(TX_KEY);
};
