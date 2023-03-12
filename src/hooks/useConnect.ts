import TonWeb from "tonweb";
import { useState } from "react"
import { Address } from "tonweb/dist/types/utils/address";

export default function useConnect(window: Window & typeof globalThis, tonweb: TonWeb) {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<Address>();
  const [walletHistory, setWalletHistory] = useState<Address[]>([]);
  const connectWallet = async () => {
    setLoading(true)
    let wallet;
    try {
      //@ts-ignore
      if (window.tonProtocolVersion || window.tonProtocolVersion > 1) {
        //@ts-ignore
        if (window.ton.isTonWallet) {
          console.log('TON Wallet Extension found!')
        }
        //@ts-ignore
        const provider = window.ton
        const accounts = await provider.send('ton_requestWallets')

        const tonWalletAddr = new TonWeb.utils.Address(accounts[0].address)
        // wallet = tonweb.wallet.create({ tonWalletAddr });
        // wallet.methods.transfer()
        console.log('Connected accounts:',accounts)

        console.log('Connected wallet address:',tonWalletAddr.toString(true, true, true))
        console.log('------------------',tonWalletAddr)
        setWalletAddress(tonWalletAddr)
        setWalletHistory(await tonweb.getTransactions(tonWalletAddr))

      } else {
        alert('Please update your TON Wallet Extension 💎')
        location.href = 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd'
      }

    } catch (e) {
      console.error(e)
    }

    setLoading(false)
  }

  return {
    // wallet,
    walletAddress,
    walletHistory,
    connectWallet,
  }
}