import { useEffect, useRef } from "react";
import { Spinner } from "./spinner";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function InfiniteScroll({ onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) onLoadMore();
      },
      { threshold: 1 }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);

    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <div ref={loaderRef} className="h-20 flex items-center justify-center">
      {isLoading ? (
        <Spinner />
      ) : hasMore ? (
        <p>Cargando más datos...</p>
      ) : (
        <p>No hay más datos para cargar</p>
      )}
    </div>
  );
}
