import TonWeb from 'tonweb'; // should be on top
import { useEffect, useState } from 'react';
import useConnect from './useConnect';
import { Address } from 'tonweb/dist/types/utils/address';

export function useDeployer() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: 'bc7cdcdd65e2b75468ffbd4635583f83ded329793ae1ff0e49693eaf8720545c' }));
    const { walletAddress, walletHistory, connectWallet } = useConnect(window, tonweb);
    const { NftCollection, NftItem } = TonWeb.token.nft;
    const [nftCollection, setNftCollection] = useState<any>();
    const [collectionAddress, setCollectionAddress] = useState<Address>();
    const [nftCollectionAddress, setNftCollectionAddress] = useState<Address>();
    const [collectionHistory, setCollectionHistory] = useState<Address[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        connectWallet();
    }, [])


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

    async function deployNftCollection() {
        setLoading(true)

        const provider = window.ton

        const nftCollection = new NftCollection(tonweb.provider, {
            ownerAddress: walletAddress, // owner of the collection
            royalty: 1 / 100, // royalty in %
            royaltyAddress: walletAddress, // address to receive the royalties
            collectionContentUri: 'https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/my_collection.json', // url to the collection content
            nftItemContentBaseUri: 'https://raw.githubusercontent.com/ton-foundation/token-contract/main/nft/web-example/my_nft.json', // url to the nft item content
            nftItemCodeHex: NftItem.codeHex, // format of the nft item
        })
        console.log('Collection data:', nftCollection)
        const nftCollectionAddr = await nftCollection.getAddress()

        // check if the collection already exists
        let addresses = new Set()
        walletHistory.forEach(el => {
            try {
                addresses.add(el.out_msgs[0].destination)
            } catch (e) { }
        })

        if (addresses.has(nftCollectionAddr.toString(true, true, true))) {
            console.log('Collection already deployed!')

            setNftCollection(nftCollection)
            setCollectionAddress(nftCollectionAddr)
            const history = await tonweb.getTransactions(nftCollectionAddr)
            console.log('Collection history [1]:', history)
            setCollectionHistory(history)

            //await getInfo(nftCollection)

            setLoading(false)
        }
        console.log('Collection address (changes with provided data):',
            nftCollectionAddr.toString(true, true, true))

        const stateInit = (await nftCollection.createStateInit()).stateInit
        const stateInitBoc = await stateInit.toBoc(false)
        const stateInitBase64 = TonWeb.utils.bytesToBase64(stateInitBoc)

        provider.send(
            'ton_sendTransaction',
            [
                {
                    to: (nftCollectionAddr).toString(true, true, true),
                    value: TonWeb.utils.toNano(0.05.toString()).toString(), // 0.05 TON to cover the gas
                    stateInit: stateInitBase64,
                    dataType: 'boc',
                }],
        ).then(async res => {
            // we get TRUE or FALSE

            if (res) {
                console.log('Transaction successful')

                setCollectionAddress(nftCollectionAddr)
                setNftCollection(nftCollection)
                const history = await tonweb.getTransactions(nftCollectionAddr)
                console.log('Collection history [2]:', history)
                setCollectionHistory(history)
            } else {
                console.log('Wallet didn\'t approved minting transaction')
            }

            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })

    }

    async function deployNftItem() {
        setLoading(true)

        const provider = window.ton
        const amount = TonWeb.utils.toNano(0.05.toString())
        const newId = await getNextId();
        const body = await nftCollection.createMintBody({
            amount: amount,
            itemIndex: newId,
            itemContentUri: '',
            itemOwnerAddress: walletAddress,
        })

        const bodyBoc = await body.toBoc(false)
        const bodyBase64 = TonWeb.utils.bytesToBase64(bodyBoc)

        let collectionNftData = new Set()
        collectionHistory.forEach(el => {
            try {
                collectionNftData.add(el.in_msg.msg_data.body)
            } catch (e) { }
        })

        // check if the NFT exists in the collection
        if (collectionNftData.has(bodyBase64)) {
            console.log('NFT already deployed!')
            setLoading(false)
            return
        }

        provider.send(
            'ton_sendTransaction',
            [
                {
                    to: collectionAddress.toString(true, true, true),
                    value: amount.toString(),
                    data: bodyBase64,
                    dataType: 'boc',
                }],
        ).then(res => {

            if (res) {
                console.log('Transaction successful')
                setLoading(false)
            } else {
                console.log('Wallet didn\'t approved minting transaction')
            }

            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    return {
        deployNftCollection,
        deployNftItem,
        getInfo,
        getNextId
    };
}