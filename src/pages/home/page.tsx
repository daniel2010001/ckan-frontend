import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Footer } from "@/components/layouts";
import { Background } from "@/components/ui/background";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffectAsync, useFetchAndLoader } from "@/hooks";
import { cn } from "@/lib/utils";
import { DatasetRoutes, Notice, Option } from "@/models";
import { categories } from "@/models/ckan/dataset.model";
import { lastNotices } from "@/services";
import { NoticesCarousel } from "./components";

import { NoticeAdapter } from "@/adapters";
import organization from "@/assets/icons/organization.svg";
import popularity from "@/assets/icons/popularity.svg";
import update from "@/assets/icons/update.svg";
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

const orderBy: Array<Omit<Option, "icon"> & { icon: string }> = [
  { label: "Datos más vistos", icon: popularity, value: "popularity", disabled: true },
  { label: "Datos reciente añadidos", icon: update, value: "metadata_modified desc" },
  { label: "Datos por organización", icon: organization, value: "organization", disabled: true },
];

export function Home() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Array<Notice>>([]);
  const [query, setQuery] = useState("");

  const { callEndpoint: loadNotices } = useFetchAndLoader(useState);

  useEffectAsync({
    asyncFunction: async () => await loadNotices(lastNotices()),
    successFunction: (data) => setNotices(data.map(NoticeAdapter.toNotice)),
  });

  function handleSearch() {
    navigate(DatasetRoutes.BASE(), { state: { q: query } });
  }

  return (
    <div className="flex flex-col items-center justify-center bg-custom-primary-4/5">
      {/* Title */}
      <Background>
        <div className="flex flex-col items-center justify-center px-24 py-12 text-center">
          <div className="font-medium mb-6 font-arciform">
            <h1 className="text-6xl border-0 border-b-2 border-white">COCHABAMBA</h1>
            <h2 className="text-3xl mt-2">DATOS ABIERTOS</h2>
          </div>
          <div className="relative w-1/2 flex items-center justify-center text-black bg-white px-4 rounded-full">
            <input
              placeholder="Buscar conjunto de datos..."
              className="w-full outline-none m-2"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button size="icon" variant="ghost" className="absolute right-4" onClick={handleSearch}>
              <Search />
            </Button>
          </div>
          <p className="font-poppins mt-4 text-lg">{description}</p>
        </div>
      </Background>

      {/* Categories */}
      <div className="w-full flex flex-col items-center justify-center px-24 py-12 text-center relative">
        <h1 className="text-2xl mb-8">CATEGOR&Iacute;AS</h1>
        <div className="grid grid-cols-1 justify-center place-content-center gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.values<Option>(categories).map(({ value, label, icon: IconComponent }, index) => (
            <Link
              key={`category-${index}`}
              to={DatasetRoutes.BASE()}
              state={{ category: [value] }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border h-28 flex flex-col items-center justify-center",
                "hover:border-custom-primary-2 hover:bg-custom-primary-2/10",
                "hover:shadow-custom-primary-2/50 hover:shadow-md",
                "transform hover:translate-y-[-4px] hover:scale-105 transition-all duration-300"
              )}
            >
              {IconComponent && <IconComponent className="!size-10" />}
              <div className="flex flex-col justify-center items-start h-auto">
                <p className="text-base font-medium m-auto px-4 overflow-hidden text-ellipsis break-words whitespace-pre-wrap">
                  {label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dataset list order by */}
      <div className="w-full flex flex-col items-center justify-center px-24 py-12 text-center relative">
        <h1 className="text-2xl mb-8">VER LISTA DE DATOS</h1>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orderBy.map(({ label, icon, value }, index) => (
            <Link
              key={`order-by-${index}`}
              to={DatasetRoutes.BASE()}
              state={{ sortBy: value }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border h-36 flex flex-col items-center justify-center",
                "hover:border-custom-primary-2 hover:bg-custom-primary-2/10",
                "hover:shadow-custom-primary-2/50 hover:shadow-md",
                "transform hover:translate-y-[-4px] hover:scale-105 transition-all duration-300"
              )}
            >
              <img src={icon} alt={label} className="w-16 h-16 my-2 mx-4" />
              <p className="text-2xl font-medium mx-auto mb-4">{label}</p>
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
        <div className="col-span-1 flex flex-col items-center justify-center px-12 pb-12 text-center">
          <h1 className="text-2xl mb-4 text-custom-secondary-2">
            SECCI&Oacute;N DE &Uacute;LTIMAS NOTICIAS Y ACTUALIDADES
          </h1>
          {notices.length ? (
            <NoticesCarousel notices={notices} />
          ) : (
            <>
              <img src={noticias} alt="Noticias" className="w-full mb-4" />
              <p className="font-poppins text-base">
                Un espacio donde se publiquen novedades sobre actualizaciones de datos o proyectos
                relacionados con la plataforma.
              </p>
            </>
          )}
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
