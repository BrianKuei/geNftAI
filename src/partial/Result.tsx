import React from "react";
import ButtonComponent from "../component/Button";

interface IResult {
  onChange?(props: any): void;
}

const Result = ({ onChange }: IResult) => {
  const handleOnClick = () => {
    onChange && onChange(true);
  };

  return (
    <>
      Result
      <br />
      <ButtonComponent text="Get Started" onClick={handleOnClick} />
    </>
  );
};

export default Result;
