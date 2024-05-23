/* eslint-disable no-console */

import * as algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { ContractAClient } from './clients/ContractAClient';
import { ContractBClient } from './clients/ContractBClient';

(async () => {
  const algodClient = new algosdk.Algodv2('a'.repeat(64), 'https://testnet-api.algonode.cloud');
  const sender = algosdk.mnemonicToSecretKey(
    'review soda check explain nest donate drink bottom weather twenty toilet bounce liquid rural dust drastic miracle mimic pet pair when own artwork abstract vacuum'
  );

  console.log('Using Wallet : ' + sender.addr);

  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractACaller.create.createApplication({});

  var ContractAresult = await ContractACaller.appClient.getAppReference();
  const ContractAappId = ContractAresult.appId;
  const ContractAappAddress = ContractAresult.appAddress;

  console.log(`Contract A Deployed with appId: ${ContractAappId}\nappAddress: ${ContractAappAddress}`);

  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  var ContractBresult = await ContractBCaller.appClient.getAppReference();
  const ContractBappId = ContractBresult.appId;
  const ContractBappAddress = ContractBresult.appAddress;

  console.log(`Contract B Deployed with appId: ${ContractBappId}\nappAddress: ${ContractBappAddress}`);

  const suggestedParams = await algodClient.getTransactionParams().do();

  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBappAddress,
    amount: algokit.algos(1).microAlgos,
    suggestedParams: suggestedParams,
  });

  var stxn = txn.signTxn(sender.sk);

  await algodClient.sendRawTransaction(stxn).do();
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('Funded Contract B with 1 Algo : ' + txn.txID());
})();
