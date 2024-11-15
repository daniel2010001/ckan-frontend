import { ReactNode } from "react";

import analytical from "@/assets/icons/analytical.svg";
import bars from "@/assets/icons/bars.svg";
import dashboard from "@/assets/icons/dashboard.svg";
import database from "@/assets/icons/database.svg";
import dataset from "@/assets/icons/dataset.svg";
import graphic from "@/assets/icons/graphic.svg";

const backgroundIcons: Array<{ src: string; alt: string; className: string }> = [
  {
    src: analytical,
    alt: "analytical",
    className: "absolute w-auto h-1/3 top-4 left-8 opacity-5",
  },
  {
    src: database,
    alt: "database",
    className: "absolute w-auto h-1/3 bottom-8 left-16 opacity-5",
  },
  {
    src: graphic,
    alt: "graphic",
    className: "absolute w-auto h-1/3 top-14 left-60 opacity-5",
  },
  {
    src: bars,
    alt: "bars",
    className: "absolute w-36 h-36 top-8 right-56 opacity-10",
  },
  {
    src: dashboard,
    alt: "dashboard",
    className: "absolute w-44 h-44 bottom-8 right-32 opacity-10",
  },
  {
    src: dataset,
    alt: "dataset",
    className: "absolute w-32 h-32 top-4 right-8 opacity-10",
  },
];

export function Background({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full text-white">
      <div className="absolute left-0 top-0 w-full h-full -z-10 select-none bg-gradient-to-r from-custom-primary-2 to-[#842F45] overflow-hidden">
        {backgroundIcons.map(({ src, alt, className }, index) => (
          <img key={index} src={src} alt={alt} className={className} />
        ))}
      </div>
      {children}
    </div>
  );
}
