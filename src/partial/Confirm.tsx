import React from "react";
import ButtonComponent from "../component/Button";
import useTonKeeper from "../hooks/useTonKeeper";
import toast from "../utils/toast";

interface IConfirm {
  onChange?(props: any): void;
}

const Confirm = ({ onChange }: IConfirm) => {
  const handleOnClick = () => {
    useTonKeeper({
      amount: 100,
      fallbackFunc: toast.error("APP not installed!"),
    });

    // TODO:
    // onChange && onChange(true);
  };

  const handleOnReset = () => {
    onChange && onChange({ isBack: true });
  };

  return (
    <div className="h-full">
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
