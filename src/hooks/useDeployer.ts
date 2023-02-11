import TonWeb from 'tonweb'; // should be on top
import { useEffect, useState } from 'react';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from 'ton-core';

export function useDeployer() {
    const { NftCollection, NftItem, NftMarketplace, NftSale } = TonWeb.token.nft;
    const client = useTonClient();
    const [provider, setProvider] = useState<any>();
    const [nftCollection, setNftCollection] = useState<any>();
    const [nftCollectionAddress, setNftCollectionAddress] = useState<any>();
    const [walletAddress, setWalletAddress] = useState<Address | undefined>();
    const { sender } = useTonConnect();

    // const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: '' }));
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: 'bef4b75fea1e9a5a385731779579569cb40e95eacee6d37620602b07efb13ce8' }));

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const counterContract = useAsyncInitialize(async () => {
        // @ts-ignore
        if (!window.tonProtocolVersion || window.tonProtocolVersion < 1) {
            alert('Please update your TON Wallet Extension');
            return;
        }
        // @ts-ignore   
        const providerNew = window.ton;
        setProvider(providerNew);
        const accounts = await providerNew.send('ton_requestWallets');
        const walletAddressNew = new TonWeb.utils.Address(accounts[0].address);
        // @ts-ignore
        setWalletAddress(walletAddressNew);
        console.log('wallet address=', walletAddressNew.toString(true, true, true));
    }, [provider]);

    useEffect(() => {
        async function getValue() {
            if (!counterContract) return;
            await sleep(5000); // sleep 5 seconds and poll value again

        }
        getValue();
    }, [counterContract]);

    async function getInfo(num: number): Promise<number> {
        const data = await nftCollection.getCollectionData();
        // @ts-ignore
        data.ownerAddress = data.ownerAddress.toString(true, true, true);
        console.log(data);
        const royaltyParams = await nftCollection.getRoyaltyParams();
        // @ts-ignore
        royaltyParams.royaltyAddress = royaltyParams.royaltyAddress.toString(true, true, true);
        console.log('royaltyParams: ', royaltyParams);
        console.log('getInfo: 準備拿', num);
        const nftItemAddress0 = (await nftCollection.getNftItemAddressByIndex(num)).toString(true, true, true);
        console.log('nftItemAddress0: ', nftItemAddress0);

        const nftItem = new NftItem(tonweb.provider, { address: nftItemAddress0 });
        const nftData = await nftCollection.methods.getNftItemContent(nftItem);
        // @ts-ignore
        nftData.collectionAddress = nftData.collectionAddress.toString(true, true, true);
        // @ts-ignore
        nftData.ownerAddress = nftData.ownerAddress?.toString(true, true, true);
        console.log("data???", data);
        console.log("nftData???", nftData);
        console.log("nextItemIndex???", data.nextItemIndex);
        return data.nextItemIndex;
    }

    async function getNextId(): Promise<number> {
        const data = await nftCollection.getCollectionData();
        console.log("data???", data);
        console.log("nextItemIndex???", data.nextItemIndex);
        return data.nextItemIndex;
    }

    return {
        // address: counterContract?.address.toString(),
        deployNftCollection: async () => {
            const nftCollection = new NftCollection(tonweb.provider, {
                // @ts-ignore
                ownerAddress: walletAddress,
                royalty: 0.005,
                // @ts-ignore
                royaltyAddress: walletAddress,
                collectionContentUri: 'https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/my_collection.json',
                nftItemContentBaseUri: 'https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/',
                nftItemCodeHex: NftItem.codeHex
            });

            setNftCollection(nftCollection);

            const nftCollectionAddress = await nftCollection.getAddress();

            setNftCollectionAddress(nftCollectionAddress);

            console.log('collection address=', nftCollectionAddress.toString(true, true, true));

            const stateInit = (await nftCollection.createStateInit()).stateInit;
            const stateInitBoc = await stateInit.toBoc(false);
            const stateInitBase64 = TonWeb.utils.bytesToBase64(stateInitBoc);
            // @ts-ignore
            provider?.send(
                'ton_sendTransaction',
                [{
                    to: nftCollectionAddress.toString(true, true, true),
                    value: TonWeb.utils.toNano('0.005').toString(),
                    stateInit: stateInitBase64,
                    dataType: 'boc'
                }]
            );
        },

        deployNftItem: async () => {
            const amount = TonWeb.utils.toNano("0.005");
            if (!provider) return;
            const newId = await getNextId();
            console.log("準備要 mint newId~~",newId)
            const body = await nftCollection.createMintBody({
                amount: amount,
                itemIndex: newId,
                itemOwnerAddress: walletAddress,
                itemContentUri: 'my_nft.json'
            });
            const bodyBoc = await body.toBoc(false);
            const bodyBase64 = TonWeb.utils.bytesToBase64(bodyBoc);
            provider.send(
                'ton_sendTransaction',
                [{
                    to: nftCollectionAddress.toString(true, true, true),
                    value: amount.toString(),
                    data: bodyBase64,
                    dataType: 'boc'
                }]
            );
            await getInfo(newId);
            return newId;
        },

        getInfo: getInfo,

        getNextId: getNextId
    };
}
