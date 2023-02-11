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

  return (
    <>
      Confirm
      <br />
      <ButtonComponent text="Get Started" onClick={handleOnClick} />
    </>
  );
};

export default Confirm;
