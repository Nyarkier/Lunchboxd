import msg from "../assets/message.svg";
import fb from "../assets/fb.svg";
import ig from "../assets/ig.svg";

export function Footer() {
  return (
    <div className="flex flex-row justify-between items-center h-[150px] bg-[#313647] pr-[154px] pl-[80px]">
      <div className="flex flex-col m-0 p-0 gap-0 ">
        <div className="font-inherit text-white m-0 text-[50px] font-bold p-0 leading-none">
          lunchboxd
        </div>
        <div className="m-0 p-0 text-[#888888] leading-none">
          Copyright ©2026. All rights reserve{" "}
        </div>
      </div>
      <div className="flex flex-row gap-[50px]">
        <img className="w-[35px]" src={msg} />
        <img className="w-[35px]" src={fb} />
        <img className="w-[35px]" src={ig} />
      </div>
    </div>
  );
}
