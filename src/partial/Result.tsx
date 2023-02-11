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
    <div className="h-full space-y-2">
      <div className="w-full space-y-2">
        <div className="text-bold">Preview</div>
        {/* TODO: */}
        <iframe className="w-full border" />
      </div>

      <div className="w-full space-y-2">
        <div className="text-bold">Link</div>
        {/* TODO: */}
        <p className="text-gray-300">https://</p>
      </div>

      <div className="absolute bottom-[3vh] space-x-2">
        {/* TODO: */}
        <div>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type.
        </div>
        <ButtonComponent text="Open in Browser" onClick={handleOnReset} />
        <ButtonComponent text="Share" type="primary" onClick={handleOnClick} />
      </div>
    </div>
  );
};

export default Confirm;
