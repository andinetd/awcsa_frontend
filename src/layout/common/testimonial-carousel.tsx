"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    quote:
      "This organization has been a beacon of hope for countless women in our community. Their dedication and support have transformed so many lives.",
    name: "Jane Doe",
    title: "Community Leader",
  },
  {
    quote:
      "The resources and programs offered here are invaluable. I've seen firsthand the positive impact on women's empowerment and social well-being.",
    name: "John Smith",
    title: "Social Worker",
  },
  {
    quote:
      "A truly inspiring team doing incredible work. They are making a real difference in the fight for gender equality and social justice.",
    name: "Emily White",
    title: "Volunteer",
  },
  {
    quote:
      "I am so grateful for the support I received from this organization. They helped me get back on my feet and build a better future for myself and my children.",
    name: "Maria Garcia",
    title: "Beneficiary",
  },
  {
    quote:
      "The workshops and training sessions are top-notch. They provide practical skills and knowledge that empower women to succeed.",
    name: "David Lee",
    title: "Partner Organization",
  },
];

export default function TestimonialCarousel() {
  const t = useTranslations();
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      id="testimonials"
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
          {t("testimonials.title")}
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 text-center mt-4">
          {t("testimonials.description")}
        </p>
        <div className="mt-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-start p-6">
                        <p className="text-lg font-medium leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <footer className="mt-4">
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.title}
                          </p>
                        </footer>
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
