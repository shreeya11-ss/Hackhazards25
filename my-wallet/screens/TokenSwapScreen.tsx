// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     Button,
//     Alert,
//     StyleSheet,
//     ActivityIndicator,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// export default function TokenSwapScreen() {
//     const [fromAsset, setFromAsset] = useState('XLM');
//     const [toAsset, setToAsset] = useState('USDC');
//     const [amount, setAmount] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [estimatedReturn, setEstimatedReturn] = useState<string | null>(null);

//     const availableAssets = ['XLM', 'USDC', 'MOBI'];
//     const usdcIssuer = 'GA5ZSE6GZ4G2J3RQKWN5GHWT23M3ZZ2EXAMPLE'; // Replace with actual USDC issuer on testnet

//     const fetchSwapEstimate = async () => {
//         if (!amount || isNaN(Number(amount))) {
//             Alert.alert('Error', 'Please enter a valid amount.');
//             return;
//         }

//         setLoading(true);
//         setEstimatedReturn(null);
//         try {
//             const response = await fetch(
//                 `https://horizon-testnet.stellar.org/paths/strict-send?source_asset_type=native&source_amount=${amount}&destination_asset_type=credit_alphanum4&destination_asset_code=${toAsset}&destination_asset_issuer=${usdcIssuer}`
//             );
//             const data = await response.json();
//             if (data && data.records && data.records.length > 0) {
//                 const bestPath = data.records[0];
//                 const destAmount = bestPath.destination_amount;
//                 setEstimatedReturn(destAmount);
//             } else {
//                 setEstimatedReturn('0');
//             }
//         } catch (err: any) {
//             console.error('Error fetching path:', err);
//             Alert.alert('Error', 'Could not fetch exchange path.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSwap = () => {
//         Alert.alert('Swap Initiated', `Swapping ${amount} ${fromAsset} to ${toAsset}`);
//         // 🔜 In Step 2 we'll build and submit the actual swap transaction here
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>🔁 Token Swap</Text>

//             <Text style={styles.label}>From:</Text>
//             <Picker
//                 selectedValue={fromAsset}
//                 onValueChange={setFromAsset}
//                 style={styles.picker}
//             >
//                 {availableAssets.map((asset) => (
//                     <Picker.Item label={asset} value={asset} key={asset} />
//                 ))}
//             </Picker>

//             <Text style={styles.label}>To:</Text>
//             <Picker
//                 selectedValue={toAsset}
//                 onValueChange={setToAsset}
//                 style={styles.picker}
//             >
//                 {availableAssets.map((asset) => (
//                     <Picker.Item label={asset} value={asset} key={asset} />
//                 ))}
//             </Picker>

//             <Text style={styles.label}>Amount:</Text>
//             <TextInput
//                 value={amount}
//                 onChangeText={setAmount}
//                 keyboardType="decimal-pad"
//                 style={styles.input}
//                 placeholder="Enter amount"
//             />

//             <Button title="Get Estimate" onPress={fetchSwapEstimate} disabled={loading} />

//             {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
//             {estimatedReturn && (
//                 <Text style={styles.result}>
//                     Estimated Return: {estimatedReturn} {toAsset}
//                 </Text>
//             )}

//             <Button
//                 title="Swap Tokens"
//                 onPress={handleSwap}
//                 disabled={!estimatedReturn || estimatedReturn === '0'}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         flex: 1,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     label: {
//         marginTop: 10,
//         fontWeight: '600',
//     },
//     picker: {
//         backgroundColor: '#f1f1f1',
//         marginVertical: 5,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#aaa',
//         borderRadius: 6,
//         padding: 8,
//         marginVertical: 10,
//     },
//     result: {
//         marginTop: 20,
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const assets = {
  XLM: { code: 'XLM', issuer: null },
  MOBI: { code: 'MOBI', issuer: 'GA6HCMBLTZS5VYYP4ZB7Y54J5XHNG4YIXTOB47QEP3IXPAGSVI3C44TJ' },
  USDC: { code: 'USDC', issuer: 'GA5ZSEBQYCDHVWVPL2MOTNA7GHFKBOHZTGZKYITRAZDDO7E3I3FVJROQ' },
};

export default function TokenSwapScreen() {
  const [sourceToken, setSourceToken] = useState<'XLM' | 'MOBI' | 'USDC'>('XLM');
  const [amount, setAmount] = useState('');
  const [estimated, setEstimated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getOrderbookPrice = async () => {
    if (!amount || isNaN(Number(amount))) return;

    const selling = assets[sourceToken];
    const buying = assets['USDC'];
    const sellingParams = selling.issuer
      ? `selling_asset_type=credit_alphanum4&selling_asset_code=${selling.code}&selling_asset_issuer=${selling.issuer}`
      : `selling_asset_type=native`;
    const buyingParams = `buying_asset_type=credit_alphanum4&buying_asset_code=${buying.code}&buying_asset_issuer=${buying.issuer}`;
    const url = `https://horizon-testnet.stellar.org/order_book?${sellingParams}&${buyingParams}&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.asks && data.asks.length > 0) {
        const bestPrice = parseFloat(data.asks[0].price);
        const receive = (parseFloat(amount) * bestPrice).toFixed(5);
        setEstimated(receive);
      } else {
        setEstimated('0');
      }
    } catch (error) {
      console.error('Orderbook fetch error', error);
      setEstimated(null);
    }
  };

  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      getOrderbookPrice();
    } else {
      setEstimated(null);
    }
  }, [amount, sourceToken]);

  const handlePreview = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid amount', 'Please enter a valid number');
      return;
    }

    if (sourceToken === 'USDC') {
      Alert.alert('Swap not supported', 'You cannot swap USDC to USDC');
      return;
    }

    Alert.alert('Swap Preview', `You will swap ${amount} ${sourceToken} to ~${estimated || '...'} USDC`);
  };
  const handleSwap = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid amount', 'Please enter a valid number');
      return;
    }
    const source = assets[sourceToken];
    const destination = assets[sourceToken];
    const amountToSend = parseFloat(amount).toFixed(7);
    try {
      const pathRes = await fetch(
        `https://horizon-testnet.stellar.org/paths/strict-send?source_asset_type=${
          source.issuer ? 'credit_alphanum4' : 'native'
        }&source_asset_code=${source.code}&source_asset_issuer=${source.issuer || ''}&source_amount=${amountToSend}&destination_asset_type=credit_alphanum4&destination_asset_code=${destination.code}&destination_asset_issuer=${destination.issuer}`
      );
      const pathData = await pathRes.json();
  
      if (!pathData.records || pathData.records.length === 0) {
        Alert.alert('No path found', 'Stellar DEX could not find a conversion path.');
        return;
      }
      const bestPath = pathData.records[0];
      // 👇 Replace these with your actual secret and public key from your wallet state
      const sourceSecretKey = 'SBAJIYRHHVK35NCQ2DS37KFMRU7BWJL7HNRBQMXINZ5N5BOKBJHE4WVI';
      const sourcePublicKey = 'GAMIVAZ2IWAHPPTV72PWONEONADACNMJKF4O5JTW4OM4O2V3WHJQVWMX';
      const StellarSdk = require('stellar-sdk');
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
      const account = await server.loadAccount(sourcePublicKey);
      const sourceAsset = source.issuer
        ? new StellarSdk.Asset(source.code, source.issuer)
        : StellarSdk.Asset.native();
      const destAsset = sourceAsset;
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.pathPaymentStrictSend({
            sendAsset: sourceAsset,
            sendAmount: amountToSend,
            destination: sourcePublicKey, // 👈 or change to someone else if sending to another person
            destAsset: destAsset,
            destMin: amountToSend,
            // path: bestPath.path.map((p:any) => new StellarSdk.Asset(p.asset_code, p.asset_issuer)),
            path:[], 
        })

        )
        .setTimeout(30)
        .build();
  
      transaction.sign(sourceKeypair);
      const result = await server.submitTransaction(transaction);
      Alert.alert('✅ Swap successful!', `Transaction ID: ${result.hash}`);
    } catch (e:any) {
      console.error(e);
      Alert.alert('Swap Failed', e.message || 'Something went wrong');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔁 Swap Tokens to USDC</Text>

      <Text style={styles.label}>Select Source Token:</Text>
      <Picker
        selectedValue={sourceToken}
        onValueChange={(itemValue) => setSourceToken(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="XLM" value="XLM" />
        <Picker.Item label="MOBI" value="MOBI" />
      </Picker>

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
      />

      {estimated && (
        <Text style={styles.estimate}>
          🔄 Estimated Receive: {estimated} USDC
        </Text>
      )}

<Button title="Swap Now" onPress={handleSwap} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  estimate: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});