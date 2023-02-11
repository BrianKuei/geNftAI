import React from "react";
import ButtonComponent from "../component/Button";
import { useNavigate } from "react-router-dom";

interface IConfirm {
  // TODO:
  projectInfo?: any;
  onChange?(props: any): void;
}

const Confirm = ({ projectInfo, onChange }: IConfirm) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    // TODO:
    // share link to TG channel
  };

  const handleOpenBrowser = () => {
    navigate(
      `/geNftAI/web?imgUrl=${projectInfo?.imgUrl}&projectName=${projectInfo?.projectName}`
    );
  };

  return (
    <div className="w-full h-full space-y-2 flex flex-col">
      <div className="h-full">
        <div className="w-full space-y-2">
          <div className="text-bold">Preview</div>
          <iframe
            src={projectInfo?.resultLink || "https://www.google.com/"}
            className="w-full"
          >
            你的瀏覽器不支援 iframe
          </iframe>
        </div>

        <div className="w-full space-y-2">
          <div className="text-bold">Link</div>
          <p className="text-gray-300">
            {projectInfo?.resultLink || "https://www.google.com/"}
          </p>
        </div>
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
