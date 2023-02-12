import { DownSquareOutlined, BellOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import toast from "../utils/toast";
import ButtonComponent from "./Button";
import { useDeployer } from "../hooks/useDeployer";
import { useSearchParams } from "react-router-dom";

const WebSiteComponent = () => {

  const [searchParams] = useSearchParams();
  let imgUrl = searchParams.get("imgUrl");
  let projectName = searchParams.get("projectName");
  let jsonUrl = searchParams.get("jsonUrl");

  
  function truncateString(str: any, start = 0, length = 5) {
    return str.slice(start, start + length) + "..." + str.slice(-length);
  }
  let deployer = useDeployer();

  return (
    <div className="w-full h-screen flex flex-col justify-center space-y-10 py-[15px] px-[15px] bg-black text-white">
      <div className="h-[320px] w-full flex justify-center items-center">
        {/* <video poster="https://assets.manifold.xyz/image/upload/c_limit,q_80,w_1024/256fc4681a892276d16ab2de9611a65a47756753d06219389bd501e115cdb086.jpg" src="https://assets.manifold.xyz/video/upload/c_limit,q_80,w_1024/f9129cc6d28c72b40b80780e2976cdee18e4e0658bc9d6805d348da531254e03.mp4" className="w-[320px] h-[320px]"></video> */}
        {/* <img src={imgUrl} /> */}
        <iframe src={JSON.parse(localStorage.getItem("projectInfo")).imgUrl} className="w-full min-h-[300px]">
          你的瀏覽器不支援 iframe
        </iframe>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-white text-3xl">{projectName.toLocaleUpperCase()}</h1>
        <div className="flex flex-row justify-center items-center space-x-3">
          <img className="rounded-full" src="https://i.pravatar.cc/40" alt="" />
          <div>{truncateString('EQBKqHxJacGr_GfydlGJuiHqRZjXi0qmM9xXd-B4s2xUUgn_')}</div>
          <Tooltip placement="bottom" color="hsl(0deg, 0%, 42%)" title={'OPEN'}>
            <DownSquareOutlined />
          </Tooltip>
        </div>
        <div className="flex flex-row items-center justify-center rounded border px-3 py-1 mt-3 cursor-pointer" onClick={() => {
          toast.success("Subscribe")
        }}>
          <BellOutlined />
          <div>Subscribe</div>
        </div>
      </div>
      <ButtonComponent type="default" text="Mint" onClick={async () => {
        await deployer.deployNftCollection();
        await deployer.deployNftItem(jsonUrl);
      }} />
    </div>
  );
};

export default WebSiteComponent;
