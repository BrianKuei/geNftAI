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
      <img src="https://fakeimg.pl/300x120/" alt="img" className="w-full" />

      <div>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type.
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
