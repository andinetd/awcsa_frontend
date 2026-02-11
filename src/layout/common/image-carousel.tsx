"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { CMSContent } from "@/types/cms";

export default function ImageCarousel({ items }: { items?: CMSContent[] }) {
  const t = useTranslations();

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
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {galleryItems.map((src, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <Image
                          src={src}
                          alt={t("gallery.imageAlt", { number: index + 1 })}
                          width={400}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      </CardContent>
                    </Card>
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
