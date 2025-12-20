import { Outlet } from "react-router";
import { Snow } from "../components/canvas/snow";

export const Layout = () => {
  return (
    <div className="relative w-480 h-270 flex justify-center items-center overflow-hidden bg-(--bg-dark)">
      <Snow />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
