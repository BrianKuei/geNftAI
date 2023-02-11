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
    <div className="h-full space-y-2">
      <img
        src="https://cdn.pixabay.com/photo/2022/12/06/00/47/web3-7637962_1280.jpg"
        alt="web3"
      />

      <div className="text-2xl font-bold">No technology NFT release!</div>
      <div className="text-lg font-bold">
        To solve this problem by providing a simple and accessible way for
        people to create and mint their own NFTs.
      </div>

      <div className="absolute bottom-[3vh]">
        <ButtonComponent
          text="Get Started"
          type="primary"
          onClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export default Landing;
