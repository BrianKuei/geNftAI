import TonWeb from 'tonweb'; // should be on top
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import '@twa-dev/sdk';
import React, { useState, useEffect } from 'react';
import { useDeployer } from './hooks/useDeployer';

function App() {
  const [init, setInit] = useState(false);
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const { deployNftCollection, deployNftItem, getInfo, getNextId } = useDeployer();

  return (
    <div className='App'>

      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{ address?.slice(0, 30) + '...' }</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{ value ?? 'Loading...' }</div>

        </div>

        <a
          className={ `Button ${connected ? 'Active' : 'Disabled'}` }
          onClick={ async () => {
            await sendIncrement();
          } }
        >
          Increment
        </a>

        <a
          className={ `Button ` }
          onClick={ async () => {
            await deployNftCollection();
            
          } }
        >
          createCollectionButton
        </a>

        <a
          className={ `Button ` }
          onClick={ async () => {
            await deployNftItem();
          } }
        >
          createNftButton
        </a>

        <p>叱血狂族卍S傲龍聯盟</p>
      </div>
    </div>
  );
};

export default App;
