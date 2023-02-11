import React from 'react';
import '@twa-dev/sdk';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useDeployer } from './hooks/useDeployer';
import './App.css';

function App() {
  const { deployNftCollection, deployNftItem, getInfo, getNextId } = useDeployer();

  return (
    <div className='App'>

      <div className='Container'>
        <TonConnectButton />
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
