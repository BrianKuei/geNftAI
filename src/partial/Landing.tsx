import React from "react";
import ButtonComponent from "../component/Button";

interface ILanding {
  onChange?(props: any): void;
}

const Landing = ({ onChange }: ILanding) => {
  const handleOnClick = () => {
    onChange && onChange(true);
  };

  return (
    <>
      landing
      <br />
      <ButtonComponent text="Get Started" onClick={handleOnClick} />
    </>
  );
};

export default Landing;
