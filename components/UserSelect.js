import { useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function Users(props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center ">
      {props.feed.map((e) => {
        return (
          <div
            className="bg-slate-100 rounded-md w-40 cursor-pointer h-10"
            onClick={() => props.setID(e.id)}
          >
            {e.name}
          </div>
        );
      })}
    </div>
  );
}
