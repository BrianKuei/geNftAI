import React from "react";
import ButtonComponent from "../component/Button";

interface IConfirm {
  onChange?(props: any): void;
}

const Confirm = ({ onChange }: IConfirm) => {
  const handleOnClick = () => {
    window.open(`ton://transfer/kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX?amount=1000`, '_blank');
    onChange && onChange(true);
  };

  const handleOnReset = () => {
    onChange && onChange({ isBack: true });
  };

  return (
    <div className="h-full">
      {/* TODO: use iframe instead img tag because the short url
      <iframe src="https://reurl.cc/WDa5VZ/" className="w-full">
        你的瀏覽器不支援 iframe
      </iframe> */}

      <img src="https://fakeimg.pl/300/" alt="img" className="w-full" />

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
