import TonWeb from 'tonweb'; // should be on top
import { Button, Result } from "antd";
import React, { useState,useEffect } from "react";
import { Info } from "../App";
import ButtonComponent from "../component/Button";
import useConnect from '../hooks/useConnect';

interface IConfirm {
  projectInfo: Info;
  setProjectInfo: React.Dispatch<React.SetStateAction<Info>>;
  onChange?(props: any): void;
}

const Confirm = ({ projectInfo, onChange, setProjectInfo }: IConfirm) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', { apiKey: 'bc7cdcdd65e2b75468ffbd4635583f83ded329793ae1ff0e49693eaf8720545c' }));
  const { walletAddress, walletHistory, connectWallet } = useConnect(window, tonweb);
  localStorage.setItem("projectInfo", JSON.stringify(projectInfo));
  useEffect(() => {
        connectWallet();
    }, [])
  //@ts-ignore
  const provider = window.ton;
  const handleOnClick = () => {
    provider.send(
      'ton_sendTransaction',
      [{
        to: 'kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX', // TON Foundation
        value: '50000', // 50000 nanotons = 0.00005 TONs
        // data: '',
        // dataType: 'text'
      }]
    ).then(async res => {
      console.log("收費成功：", res);
    }).catch(err => {
      console.error("收費失敗：", err);
    });

    // window.open(
    //   `https://app.tonkeeper.com/transfer/kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX?amount=1000&open=1`,
    //   "_blank"
    // );

    setTimeout(() => {
      setShowConfirm(true);
    }, 3000);
  };

  const getImgJson = async () => {
    fetch("https://genftai.glitch.me/api/getjsonurl", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
      },
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify({
        name: projectInfo.projectName,
        description: projectInfo.description,
        image: projectInfo.imgUrl,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProjectInfo((s) => ({
          ...s,
          jsonUrl: data.url,
        }));
      });
  };

  // onChange && onChange(true);
  const handleOnReset = () => {
    onChange && onChange({ isBack: true });
  };

  return (
    <div className="w-full h-full flex flex-col">
      { showConfirm ? (
        <Result
          status="success"
          title="Successfully Purchased NFT"
          subTitle="Order number: 2017182818828182881 NFT configuration takes 1-5 minutes, please wait."
          extra={ [
            <Button
              type="primary"
              key="console"
              onClick={ () => {
                getImgJson();
                onChange && onChange(true);
              } }
            >
              Go Preview
            </Button>,
          ] }
        />
      ) : (
        <>
          <div className="h-full">
            <iframe src={ projectInfo?.imgUrl } className="w-full min-h-[300px]">
              你的瀏覽器不支援 iframe
            </iframe>
          </div>

          <div className="flex space-x-2">
            <ButtonComponent
              text="Reset"
              onClick={ handleOnReset }
              style={ { width: "100%" } }
            />
            <ButtonComponent
              text="Confirm"
              style={ {
                backgroundColor: "#1890ff",
                color: "#ffffff",
                width: "100%",
              } }
              onClick={ handleOnClick }
            />
          </div>
        </>
      ) }
    </div>
  );
};

export default Confirm;
