import { Link } from "react-router-dom";

import { Footer } from "@/components/layouts";
import { Background, Button, buttonVariants, Input, Separator } from "@/components/ui/";
import { cn } from "@/lib/utils";
import { DatasetRoutes } from "@/models";

import callCenterData from "@/assets/icons/call-center-data.svg";
import environment from "@/assets/icons/environment.svg";
import health from "@/assets/icons/health.svg";
import organization from "@/assets/icons/organization.svg";
import overdue from "@/assets/icons/overdue.svg";
import popularity from "@/assets/icons/popularity.svg";
import population from "@/assets/icons/population.svg";
import townPlanning from "@/assets/icons/town-planning.svg";
import update from "@/assets/icons/update.svg";
import urbanMobility from "@/assets/icons/urban-mobility.svg";
import noticias from "@/assets/images/noticias.png";
import { Search } from "lucide-react";

const description =
  "Cochabamba Open Data es una plataforma digital que proporciona acceso libre a los datos públicos generados por la Alcaldía de Cochabamba. Este portal permite a ciudadanos, investigadores, empresas y desarrolladores explorar, descargar y utilizar conjuntos de datos en diferentes áreas. Su objetivo es fomentar la transparencia, impulsar la innovación y apoyar la toma de decisiones informadas, promoviendo así el desarrollo de aplicaciones y soluciones que beneficien a la comunidad de Cochabamba.";

const carts: Array<{ title: string; description: string }> = [
  {
    title: "MISIÓN",
    description:
      "Proporcionar acceso libre y fácil a datos públicos de la ciudad de Cochabamba, promoviendo la transparencia y facilitando la toma de decisiones informadas. Nuestra misión es servir como una herramienta fundamental para ciudadanos, investigadores, empresas y desarrolladores, contribuyendo al desarrollo sostenible y al bienestar de la comunidad.",
  },
  {
    title: "VISIÓN",
    description:
      "Convertirse en la plataforma líder de datos abiertos en Bolivia, reconocida por su utilidad, confiabilidad y facilidad de uso. Aspiramos a fomentar una cultura de transparencia, innovación y participación ciudadana en la gestión pública de Cochabamba.",
  },
];

const categories: Array<{ name: string; icon: string; to: string }> = [
  { name: "Población", icon: population, to: "population" },
  { name: "Salud", icon: health, to: "health" },
  { name: "Movilidad urbana", icon: urbanMobility, to: "urban-mobility" },
  { name: "Mora", icon: overdue, to: "overdue" },
  { name: "Medio ambiente", icon: environment, to: "environment" },
  { name: "Urbanismo", icon: townPlanning, to: "town-planning" },
  { name: "Call center data", icon: callCenterData, to: "call-center-data" },
];

const orderBy: Array<{ text: string; icon: string; sortBy: string }> = [
  { text: "Datos más vistos", icon: popularity, sortBy: "popularity" },
  { text: "Datos reciente añadidos", icon: update, sortBy: "update" },
  { text: "Datos por organización", icon: organization, sortBy: "organization" },
];

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title */}
      <Background>
        <div className="flex flex-col items-center justify-center px-24 py-12 text-center">
          <div className="font-medium mb-6">
            <h1 className="text-6xl border-0 border-b-2 border-white">COCHABAMBA</h1>
            <h2 className="text-3xl mt-2">Datos Abiertos</h2>
          </div>
          <div className="relative w-1/2 flex items-center justify-center text-black">
            <Input type="text" placeholder="Buscar datasets..." className="rounded-full bg-white" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute rounded-full right-2"
              type="submit"
            >
              <Search />
            </Button>
          </div>
          <p className="font-poppins mt-4 text-xl">{description}</p>
        </div>
      </Background>

      {/* Categories */}
      <div className="w-full flex flex-col items-center justify-center px-24 py-12 text-center relative">
        <h1 className="text-2xl mb-8">CATEGOR&Iacute;AS</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, icon, to }, index) => (
            <Link
              key={`category-${index}`}
              to={DatasetRoutes.BASE(DatasetRoutes.CATEGORY.replace(":category", to))}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex items-center justify-start border-none h-auto"
              )}
            >
              <img src={icon} alt={name} className="w-16 h-16 mb-2 mx-4" />
              <p className="text-base font-medium mx-auto">{name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Dataset list order by */}
      <div className="w-full flex flex-col items-center justify-center px-24 py-12 text-center relative">
        <h1 className="text-2xl mb-8">VER LISTA DE DATOS</h1>
        <div className="w-full grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3">
          {orderBy.map(({ text: name, icon, sortBy }, index) => (
            <Link
              key={`order-by-${index}`}
              to={DatasetRoutes.BASE()}
              state={{ sortBy: sortBy }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "flex flex-col items-center justify-start border-none h-auto"
              )}
            >
              <img src={icon} alt={name} className="w-16 h-16 my-2 mx-4" />
              <p className="text-2xl font-medium mx-auto mb-4">{name}</p>
            </Link>
          ))}
        </div>
      </div>

      <Separator className="w-full mb-12 bg-black" />

      <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mission and Vision */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {carts.map(({ title, description }, index) => (
            <div
              key={`cart-${index}`}
              className="flex flex-col items-center justify-center px-24 pb-12 text-center"
            >
              <h1 className="text-2xl mb-4 text-custom-secondary-2">{title}</h1>
              <p className="font-poppins text-base">{description}</p>
            </div>
          ))}
        </div>

        {/* News */}
        <div className="col-span-1 flex flex-col items-center justify-center px-24 pb-12 text-center">
          <h1 className="text-2xl mb-4 text-custom-secondary-2">
            SECCI&Oacute;N DE &Uacute;LTIMAS NOTICIAS Y ACTUALIDADES
          </h1>
          <img src={noticias} alt="Noticias" className="w-full mb-4" />
          <p className="font-poppins text-base">
            Un espacio donde se publiquen novedades sobre actualizaciones de datos o proyectos
            relacionados con la plataforma.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-0 left-0 flex w-full items-center">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
