import { Link } from "react-router-dom";

import { Background } from "@/components/ui/background";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import logoTransparent from "@/assets/images/logo_transparent.png";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Facebook, HouseIcon, MapPin, Phone } from "lucide-react";
import { ReactElement } from "react";

const details: Array<{ icon: ReactElement; text: string }> = [
  {
    icon: <HouseIcon className="mx-4 h-4 w-auto" />,
    text: "Gobierno Autónomo Municipal de Cochabamba",
  },
  {
    icon: <MapPin className="mx-4 h-4 w-auto" />,
    text: "Oficina central: Plaza de Armas 14 de Septiembre acera oeste",
  },
  {
    icon: <Phone className="mx-4 h-4 w-auto" />,
    text: "Telf.: 4258030 - Central piloto: 151",
  },
];

const socials: Array<{ icon: ReactElement; link: string }> = [
  { icon: <Facebook className="mx-4 h-4 w-auto" />, link: "#" },
  { icon: <TwitterLogoIcon className="mx-4 h-4 w-auto" />, link: "#" },
  { icon: <InstagramLogoIcon className="mx-4 h-4 w-auto" />, link: "#" },
];

export function Footer() {
  return (
    <Background>
      <div className="flex flex-col items-center justify-center max-h-28">
        <img src={logoTransparent} alt="logo" className="w-auto h-60" />
      </div>
      <Separator className="mt-4" />
      <div className="flex items-center justify-between font-poppins overflow-clip px-8 py-4">
        <div className="flex flex-col justify-start">
          {details.map(({ icon, text }, index) => (
            <div key={`detail-${index}`} className="flex items-center justify-start text-sm h-4">
              {icon}
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="text-sm font-medium me-4">S&iacute;guenos en:</p>
          {socials.map(({ icon, link }, index) => (
            <Link
              key={`social-${index}`}
              to={link}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>
    </Background>
  );
}
