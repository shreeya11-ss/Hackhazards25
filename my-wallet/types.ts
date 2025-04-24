// types.ts
export type RootStackParamList = {
    Home: undefined;
    Wallet: undefined;
    Send:undefined;
    // ReceiveScreen:undefined;
    Receive: { publicKey: string }; 
    TransactionHistory: { publicKey: string };
    Scan:undefined;
    Scheduled:undefined;
    ScheduleTx: undefined;

    TokenSwap:undefined;
    LoginScreen: undefined;
  RegisterScreen: undefined;
  StellPayScreen:undefined;
  
       
  };

  export type ScheduledTransaction = { id: string; destination: string; amount: string; asset: string; time:string;
    // 'XLM' or token time: string; 
    // // ISO format
     };
  