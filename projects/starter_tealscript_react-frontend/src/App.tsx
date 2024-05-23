import React from 'react';
import './styles/App.css';
import { ContractBClient } from './contracts/ContractB';
import * as algosdk from 'algosdk';

function App() {
  const algodClient = new algosdk.Algodv2('a'.repeat(64), 'https://testnet-api.algonode.cloud');
  const sender = algosdk.mnemonicToSecretKey(
    'step fury fatigue brick recall more level ignore explain figure diary van opinion antique grief when wild hockey breeze enforce cherry buffalo now ability upset'
  );

  const transaction_explorer_baseurl = "https://testnet.explorer.perawallet.app/tx/";

  const ContractAappId = Number(655102775);
  const ContractBappId = Number(655102780);
  const appCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: ContractBappId,
    },
    algodClient
  );

  const [data, setData] = React.useState<string>('');
  const [getstatus, setGetStatus] = React.useState<boolean>(false);
  const [getnotification, setGetNotification] = React.useState<string>('');

  const [typeddata, setTypedData] = React.useState<string>('');
  const [setstatus, setSetStatus] = React.useState<boolean>(false);
  const [setnotification, setSetNotification] = React.useState<string>('');

  const getdata = async () => {
    setGetNotification("");
    setData("");
    setGetStatus(true);
    const result = await appCaller.getdata({}, { apps: [ContractAappId] });
    const txnid = result.transaction.txID();
    const data = result.return as string;
    setData(data);
    setGetNotification(txnid);
    setGetStatus(false);
  };

  const setdata = async () => {
    setSetNotification("");
    setSetStatus(true);
    const result = await appCaller.setdata({ d: '  ' + typeddata }, { apps: [ContractAappId] });
    const txnid = result.transaction.txID();
    setTypedData("");
    setSetNotification(txnid);
    setSetStatus(false);
  };

  return (
    <div className="App">
      <div className="getdata_wrap">
        <input type="text" value={data} readOnly></input>
        <button
          disabled={getstatus}
          onClick={(e) => {
            getdata();
          }}
        >
          {getstatus == true ? 'Fetching..' : 'Get Data'}
        </button>
        {getnotification == '' ? null : <div className="notification">Called getdata method in Contract B with TXN Id : <a target='_blank' href={transaction_explorer_baseurl+getnotification}>{getnotification}</a></div>}
      </div>
      <div className="setdata_wrap">
        <input
          maxLength={100}
          onChange={(e) => {
            setTypedData(e.target.value);
          }}
          type="text"
        ></input>
        <button
          disabled={setstatus}
          onClick={(e) => {
            setdata();
          }}
        >
          {setstatus == true ? 'Sending Transaction..' : 'Set Data'}
        </button>
        {setnotification == '' ? null : <div className="notification">Called setdata method in Contract B with TXN Id : <a target='_blank' href={transaction_explorer_baseurl+setnotification}>{setnotification}</a></div>}
      </div>
    </div>
  );
}

export default App;
