/* eslint-disable no-console */

import * as algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { ContractAClient } from './clients/ContractAClient';
import { ContractBClient } from './clients/ContractBClient';

(async () => {
  const algodClient = new algosdk.Algodv2('a'.repeat(64), 'http://localhost', 4001);
  const kmdClient = new algosdk.Kmd('a'.repeat(64), 'http://localhost', 4002);
  const sender = await algokit.getLocalNetDispenserAccount(algodClient, kmdClient);

  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractACaller.create.createApplication({});

  const { appId } = await ContractACaller.appClient.getAppReference();
  const ContractAappId = appId;

  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  const ContractBaddress = (await ContractBCaller.appClient.getAppReference()).appAddress;

  const suggestedParams = await algodClient.getTransactionParams().do();

  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBaddress,
    amount: algokit.algos(10).microAlgos,
    suggestedParams: suggestedParams,
  });

  var stxn = txn.signTxn(sender.sk);

  await algodClient.sendRawTransaction(stxn).do();
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('funded contract b with 10 algos : ' + txn.txID());

  //   console.log(await ContractBCaller.getdata({},{apps:[Number(ContractAappId)]}));
  var data = 'contract to contract call';

  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);

  var data = 'another call';

  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);
})();
