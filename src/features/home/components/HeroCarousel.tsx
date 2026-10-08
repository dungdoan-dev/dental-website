import { getHeroSlides } from "../services/home.service";
import { HeroCarouselView } from "./HeroCarouselView";

export async function HeroCarousel() {
  const slides = await getHeroSlides();
  return <HeroCarouselView slides={slides} />;
}
