import logo from "../assets/logo.svg";
import { LogoText } from "../components/LogoText";

export function Header() {
  return (
    <div className="bg-[#435663] h-[75px] pl-[165px] flex m-0 border-none items-center justify-start">
      <div className="m-0 p-0 w-[61px] h-[50px]">
        <img className="p-0 h-inherit " src={logo} alt="lunchboxd logo" />
      </div>
      <LogoText />
    </div>
  );
}
