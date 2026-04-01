import Image from "next/image";

type MovieMediaGalleryProps = {
  images: string[];
};

export function MovieMediaGallery({ images }: MovieMediaGalleryProps) {
  if (images.length === 0) {
    return (
      <p className="text-sm text-zinc-400">No hay imagenes adicionales disponibles para esta pelicula.</p>
    );
  }

  return (
    <div className="horizontal-scroll-row" role="list" aria-label="Galeria horizontal de imagenes de la pelicula">
      {images.map((src, idx) => (
        <div key={`${src}-${idx}`} className="horizontal-scroll-item min-w-[88%] sm:min-w-[62%] md:min-w-[46%] lg:min-w-[34%]">
          <div className="glass-surface-soft relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={`Imagen adicional ${idx + 1}`}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 46vw, 34vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
