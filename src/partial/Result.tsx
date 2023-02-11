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
    <div className="h-full space-y-2">
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

      <div className="absolute bottom-[3vh] space-x-2">
        <ButtonComponent text="Open in Browser" onClick={handleOpenBrowser} />
        <ButtonComponent text="Share" type="primary" onClick={handleOnClick} />
      </div>
    </div>
  );
};

export default Confirm;
