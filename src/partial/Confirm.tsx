import React from "react";
import ButtonComponent from "../component/Button";

interface IConfirm {
  // TODO:
  projectInfo?: any;
  onChange?(props: any): void;
}

const Confirm = ({ projectInfo, onChange }: IConfirm) => {
  console.log("projectInfo", projectInfo);
  const handleOnClick = () => {
    window.open(
      `ton://transfer/kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX?amount=1000`,
      "_blank"
    );
    onChange && onChange(true);
  };

  const handleOnReset = () => {
    onChange && onChange({ isBack: true });
  };

  return (
    <div className="h-full">
      <iframe src={projectInfo?.imgUrl} className="w-full">
        你的瀏覽器不支援 iframe
      </iframe>

      <div className="absolute bottom-[3vh] space-x-2">
        <ButtonComponent text="Reset" onClick={handleOnReset} />
        <ButtonComponent
          text="Confirm"
          type="primary"
          onClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export default Confirm;
