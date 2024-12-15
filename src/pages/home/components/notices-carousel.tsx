import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Notice } from "@/models";
import { Link } from "react-router-dom";

interface CarouselPluginProps {
  notices: Array<Notice>;
}

export function NoticesCarousel({ notices }: CarouselPluginProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-md"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {notices.map((notice, index) => (
          <CarouselItem key={`notice-${index}`}>
            <div className="p-1">
              <Card className="w-full h-full">
                <CardContent className="relative flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="h-full w-full object-cover animate-heartbeat"
                  />
                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-center p-2 bg-custom-gray/60">
                    <p className="text-white text-sm font-poppins font-semibold">{notice.title}</p>
                  </div>
                  <div className="absolute top-0 right-0 flex w-auto items-center justify-center p-2 bg-custom-gray/60 rounded-bl-lg">
                    <p className="text-white text-xs font-poppins font-semibold">
                      {notice.date.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <div className="absolute top-0 left-0 flex items-center justify-center p-2 bg-custom-gray/60 rounded-br-lg">
                    <p className="text-white text-sm font-poppins font-semibold">
                      <Link to={notice.url} target="_blank" rel="noopener noreferrer">
                        Abrir
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
