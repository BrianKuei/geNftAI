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
    const [collectionHistory, setCollectionHistory] = useState<Address[]>();

    useEffect(() => {
        connectWallet();
    }, []);

    async function getInfo(num: number): Promise<number> {
        const data = await nftCollection.getCollectionData();
        // @ts-ignore
        data.ownerAddress = data.ownerAddress.toString(true, true, true);
        const royaltyParams = await nftCollection.getRoyaltyParams();
        // @ts-ignore
        royaltyParams.royaltyAddress = royaltyParams.royaltyAddress.toString(true, true, true);
        const nftItemAddress0 = (await nftCollection.getNftItemAddressByIndex(num)).toString(true, true, true);

        const nftItem = new NftItem(tonweb.provider, { address: nftItemAddress0 });
        const nftData = await nftCollection.methods.getNftItemContent(nftItem);
        // @ts-ignore
        nftData.collectionAddress = nftData.collectionAddress.toString(true, true, true);
        // @ts-ignore
        nftData.ownerAddress = nftData.ownerAddress?.toString(true, true, true);
        return data.nextItemIndex;
    }

    async function getNextId(): Promise<number> {
        const data = await nftCollection.getCollectionData();
        return data.nextItemIndex;
    }

    async function charge() {
        //@ts-ignore
        const provider = window.ton;
        // //@ts-ignore
        // //@ts-ignore
        // const ton = new TonWeb(window.ton);
        // // Send your transaction
        // // @ts-ignore
        // if (window.ton.isTonWallet) {
        //     // @ts-ignore
        //     provider.send('ton_sendTransaction', { value: "50000000", to: "kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX", data: "test" });
        // } else {
        //     alert("No wallet");
        // }

        // provider.send(
        //     'ton_sendTransaction',
        //     [{
        //         to: 'kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX', // TON Foundation
        //         value: '50000000', // 50000000 nanotons = 0.05 TONs
        //         // data: '',
        //         // dataType: 'text'
        //     }]
        // ).then(async res => {
        // }).catch(err => {
        //     console.error("收費失敗：", err);
        // });

        window.open(
            `https://app.tonkeeper.com/transfer/kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX?amount=1000&open=1`,
            "_blank"
        );
    }

    async function deployNftCollection(jsonUrl: string) {

        //@ts-ignore
        const provider = window.ton;

        const nftCollection = new NftCollection(tonweb.provider, {
            ownerAddress: walletAddress, // owner of the collection
            royalty: 1 / 100, // royalty in %
            royaltyAddress: walletAddress, // address to receive the royalties
            collectionContentUri: jsonUrl, // url to the collection content
            nftItemContentBaseUri: jsonUrl, // url to the nft item content
            nftItemCodeHex: NftItem.codeHex, // format of the nft item
        });
        const nftCollectionAddr = await nftCollection.getAddress();
        setNftCollection(nftCollection);
        // check if the collection already exists
        let addresses = new Set();
        walletHistory.forEach(el => {
            try {
                //@ts-ignore
                addresses.add(el.out_msgs[0].destination);
            } catch (e) { }
        });

        // if (addresses.has(nftCollectionAddr.toString(true, true, true))) {
            setNftCollection(nftCollection);

            setCollectionAddress(nftCollectionAddr);
            const history = await tonweb.getTransactions(nftCollectionAddr);
            setCollectionHistory(history);

            //await getInfo(nftCollection)

//        }
        console.log("Deploy--->", nftCollectionAddr.toString(true, true, true));

        const stateInit = (await nftCollection.createStateInit()).stateInit;
        const stateInitBoc = await stateInit.toBoc(false);
        const stateInitBase64 = TonWeb.utils.bytesToBase64(stateInitBoc);

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
                setCollectionAddress(nftCollectionAddr);
                setNftCollection(nftCollection);
                const history = await tonweb.getTransactions(nftCollectionAddr);
                setCollectionHistory(history);
            } else {
            }

        }).catch(err => {
            console.error(err);
        });

    }

    async function deployNftItem(jsonUrl: string | null) {
        //@ts-ignore
        const provider = window.ton;
        const amount = TonWeb.utils.toNano(0.05.toString());

        const nftCollection = new NftCollection(tonweb.provider, {
            ownerAddress: walletAddress, // owner of the collection
            royalty: 1 / 100, // royalty in %
            royaltyAddress: walletAddress, // address to receive the royalties
            collectionContentUri: jsonUrl, // url to the collection content
            nftItemContentBaseUri: jsonUrl, // url to the nft item content
            nftItemCodeHex: NftItem.codeHex, // format of the nft item
        });

        console.log("Mint ---> nftCollection", nftCollection)
        console.log("jsonUrl~~~", jsonUrl)

        const nftCollectionAddr = await nftCollection.getAddress();
        const newId = (await nftCollection.getCollectionData()).nextItemIndex;
        const body = await nftCollection.createMintBody({
            amount: amount,
            itemIndex: newId,
            itemContentUri: jsonUrl,
            itemOwnerAddress: walletAddress,
        });

        const bodyBoc = await body.toBoc(false);
        const bodyBase64 = TonWeb.utils.bytesToBase64(bodyBoc);
        console.log("nftCollectionAddr~~", nftCollectionAddr)
        
        let collectionNftData = new Set();

        (await tonweb.getTransactions(nftCollectionAddr)).forEach(el => {
            try {
                //@ts-ignore
                collectionNftData.add(el.in_msg.msg_data.body);
            } catch (e) { }
        });

        // check if the NFT exists in the collection
        if (collectionNftData.has(bodyBase64)) {
            return;
        }

        console.log("Collection~~~", nftCollectionAddr.toString(true, true, true))
        console.log("collectionNftData~~~", collectionNftData,amount.toString())
        
        provider.send(
            'ton_sendTransaction',
            [
                {
                    to: nftCollectionAddr.toString(true, true, true),
                    value: amount.toString(),
                    data: bodyBase64,
                    dataType: 'boc',
                }],
        ).then(res => {
            if (res) {
            } else {
            }

        }).catch(err => {
        });
    }

    return {
        deployNftCollection,
        deployNftItem,
        getInfo,
        getNextId,
        charge
    };
}