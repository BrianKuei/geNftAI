import React from "react";
import ButtonComponent from "../component/Button";

interface IConfirm {
  onChange?(props: any): void;
}

const Confirm = ({ onChange }: IConfirm) => {
  const handleOnClick = () => {
    onChange && onChange(true);
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
