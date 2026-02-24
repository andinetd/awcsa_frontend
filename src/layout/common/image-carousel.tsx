"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";

import { CMSContent } from "@/types/cms";

export default function ImageCarousel({ items }: { items?: CMSContent[] }) {
  const t = useTranslations();
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  );

  const staticImages = [
    "/assets/WCSA_logo.jpg",
    "/assets/WCSA_logo.jpg",
    "/assets/WCSA_logo.jpg",
    "/assets/WCSA_logo.jpg",
    "/assets/WCSA_logo.jpg",
  ];

  const galleryItems =
    items && items.length > 0
      ? items
          .filter((i) => i.isVisible)
          .map((item) => item.imageUrl || "/assets/WCSA_logo.jpg")
      : staticImages;

  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      id="gallery"
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
          {t("gallery.title")}
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 text-center mt-4">
          {t("gallery.description")}
        </p>
        <div className="mt-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {galleryItems.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full md:basis-1/2"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={src}
                      alt={t("gallery.imageAlt", { number: index + 1 })}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
