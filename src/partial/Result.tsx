import React from "react";
import ButtonComponent from "../component/Button";
import { useNavigate } from "react-router-dom";
import toast from "../utils/toast";

interface IConfirm {
  projectInfo?: any;
  onChange?(props: any): void;
}

const Confirm = ({ projectInfo, onChange }: IConfirm) => {
  const link = `/geNftAI/web?imgUrl=${projectInfo?.imgUrl}&projectName=${projectInfo?.projectName}&jsonUrl=${projectInfo?.jsonUrl}`
  const navigate = useNavigate();
  const handleOnClick = () => {
    toast.success('Copy Link');
  };

  const handleOpenBrowser = () => {
    navigate(
      link
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-screen">
        <div className="text-bold">Preview</div>
        <iframe
          src={link || "https://www.google.com/"}
          className="w-full h-[450px]"
        >
          你的瀏覽器不支援 iframe
        </iframe>
      </div>

      <div className="flex w-full space-x-2">
        <ButtonComponent
          text="Open in Browser"
          onClick={handleOpenBrowser}
          style={{ width: "100%" }}
        />
        <ButtonComponent
          text="Share"
          style={{
            backgroundColor: "#1890ff",
            color: "#ffffff",
            width: "100%",
          }}
          onClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export default Confirm;
