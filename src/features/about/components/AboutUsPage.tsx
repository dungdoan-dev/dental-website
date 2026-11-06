import Image from "next/image";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { CoreValuesSection } from "@/features/home/components/CoreValuesSection";
import { VisionMissionSection } from "@/features/home/components/VisionMissionSection";
import { toAboutImage } from "../data/about-content";
import type { AboutPageData } from "../schemas/about.schema";
import { ZoomImage } from "./AboutLightbox";
import { aboutEyebrow, aboutHeading, aboutLead, heroWash } from "./AboutShared";

const section = "scroll-mt-40 py-16";

export function AboutUsPage({ content }: { content: AboutPageData }) {
  const { hero, highlights, founder, history, facilities } = content;
  const heroImage = toAboutImage(hero.photo);
  const founderImage = toAboutImage(founder.photo);
  const archive = history.archive.map(toAboutImage);
  const rooms = facilities.rooms.map((room) => ({ ...room, img: toAboutImage(room.photo) }));
  const equipment = facilities.equipment.map((item) => ({ ...item, img: toAboutImage(item.photo) }));
  const facilityGallery = [...rooms.map((room) => room.img), ...equipment.map((item) => item.img)];

  return (
    <>
      <section className={`${heroWash} pb-14 pt-7`}>
        <Container>
          <Breadcrumb className="mb-6" items={[{ label: "Giới thiệu" }]} />
          <div className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-2">
            <div>
              <p className={aboutEyebrow}>Giới thiệu</p>
              <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-text-primary">{hero.title}</h1>
              <p className={`${aboutLead} max-w-[540px] text-lg`}>{hero.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <AppointmentButton className="gap-2"><Icon className="h-5 w-5" name="calendar" />Đặt lịch tư vấn</AppointmentButton>
                <a className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-bold text-brand-blue-dark underline underline-offset-4" href="#cau-chuyen">Khám phá câu chuyện của chúng tôi<Icon className="h-[18px] w-[18px]" name="arrow-right" /></a>
              </div>
            </div>
            <figure>
              <ZoomImage className="aspect-[4/3]" img={heroImage} position="50% 70%" priority />
              <figcaption className="mt-2.5 text-[13px] text-text-secondary">{heroImage.caption}</figcaption>
            </figure>
          </div>
          {highlights.length ? (
            <dl className="mt-12 grid border-t border-border-subtle sm:grid-cols-3">
              {highlights.map((item) => (
                <div className="flex flex-col-reverse pr-6 pt-5" key={item.value}>
                  <dt className="mt-1 text-sm text-text-secondary">{item.label}</dt>
                  <dd className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-blue-dark">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </section>

      <section aria-labelledby="about-founder" className={`${section} bg-white`} id="cau-chuyen">
        <Container className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-2">
          <figure className="mx-auto w-full max-w-[460px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#bfe6fa]">
              <Image alt={founderImage.alt} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 460px" src={founderImage.src} style={{ objectPosition: "50% 15%" }} />
            </div>
            <figcaption className="mt-3.5">
              <p className="text-[17px] font-bold text-text-primary">{founder.name}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{founder.role}</p>
            </figcaption>
          </figure>
          <div>
            <p className={aboutEyebrow}>Gặp gỡ người sáng lập</p>
            <h2 className={aboutHeading} id="about-founder">{founder.name}</h2>
            <div className="mt-4 grid gap-3.5 text-base leading-[1.75] text-text-primary">
              {founder.paragraphs.map((paragraph, index) => <p className={index > 0 ? "text-text-secondary" : undefined} key={index}>{paragraph}</p>)}
            </div>
            <ul className="mt-6 grid gap-2.5">
              {founder.credentials.map((item) => <li className="flex gap-2.5 text-[15px] leading-[1.55] text-text-primary" key={item}><Icon className="mt-px h-5 w-5 shrink-0 text-brand-green-dark" name="check-circle" />{item}</li>)}
            </ul>
            <ul aria-label="Phẩm chất" className="mt-6 flex flex-wrap gap-2">
              {founder.traits.map((trait) => <li className="rounded-full border border-brand-blue-dark px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.04em] text-brand-blue-dark" key={trait}>{trait}</li>)}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-history" className={`${section} bg-background-secondary`} id="lich-su">
        <Container>
          <div className="max-w-[720px]">
            <p className={aboutEyebrow}>Lịch sử hình thành</p>
            <h2 className={aboutHeading} id="about-history">{history.title}</h2>
            <p className={aboutLead}>{history.intro}</p>
          </div>
          <ol className="mt-10 grid gap-10">
            {history.milestones.map((milestone, index) => {
              // Dots go green / blue / blue / green like the catalogue timeline.
              const tone = index % 4 === 0 || index % 4 === 3 ? "green" : "blue";
              const color = tone === "green" ? "text-brand-green-dark" : "text-brand-blue-dark";
              const images = milestone.photos.map(toAboutImage);
              const [first, ...rest] = images;
              return (
                <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(16px,3vw,32px)]" key={`${milestone.date}-${index}`}>
                  <div aria-hidden="true" className="flex flex-col items-center">
                    <span className={`mt-1.5 h-4 w-4 rounded-full shadow-[0_0_0_5px_#fff] ${tone === "green" ? "bg-brand-green-dark" : "bg-brand-blue-dark"}`} />
                    {index < history.milestones.length - 1 ? <span className="-mb-10 mt-2 w-0.5 flex-1 bg-border-subtle" /> : null}
                  </div>
                  <div className="grid items-start gap-x-8 gap-y-5 md:grid-cols-2">
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><time className={`text-2xl font-extrabold tracking-[-0.02em] ${color}`}>{milestone.date}</time><span className="text-[13px] font-bold uppercase tracking-[0.05em] text-text-secondary">{milestone.tag}</span></p>
                      <h3 className="mt-1.5 text-xl font-bold leading-[1.35] text-text-primary">{milestone.title}</h3>
                      {milestone.stat ? <p className={`mt-2.5 inline-block rounded-full px-3 py-1 text-[13px] font-bold ${tone === "green" ? "bg-brand-green-light" : "bg-brand-blue-light"} ${color}`}>{milestone.stat}</p> : null}
                      <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">{milestone.text}</p>
                    </div>
                    {first ? (
                      <div className={`grid gap-2 ${rest.length ? "grid-cols-[2fr_1fr]" : ""}`}>
                        <ZoomImage className={rest.length > 1 ? "row-span-2 h-full min-h-[260px]" : rest.length ? "aspect-[4/3]" : "aspect-video"} gallery={images} img={first} />
                        {rest.slice(0, 2).map((img, i) => <ZoomImage className="aspect-[4/3]" gallery={images} img={img} index={i + 1} key={`${img.src}-${i}`} sizes="(max-width: 768px) 33vw, 200px" />)}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          {archive.length ? (
            <div className="mt-12">
              <h3 className="text-[15px] font-bold text-text-primary">Tư liệu những năm đầu</h3>
              <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
                {archive.map((img, i) => <ZoomImage className="aspect-[4/3]" gallery={archive} img={img} index={i} key={`${img.src}-${i}`} sizes="200px" />)}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Same components and data as the home page. */}
      <div className="scroll-mt-40 border-t border-border-subtle" id="gia-tri"><CoreValuesSection /></div>
      <div className="scroll-mt-40" id="tam-nhin"><VisionMissionSection /></div>

      <section aria-labelledby="about-facilities" className={`${section} bg-white`} id="co-so-vat-chat">
        <Container>
          <div className="max-w-[720px]"><p className={aboutEyebrow}>Cơ sở vật chất & trang thiết bị</p><h2 className={aboutHeading} id="about-facilities">{facilities.title}</h2></div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room, i) => (
              <figure key={`${room.title}-${i}`}>
                <ZoomImage className="aspect-[6/5]" gallery={facilityGallery} img={room.img} index={i} sizes="(max-width: 640px) 100vw, 300px" />
                <figcaption className="mt-3.5"><h3 className="text-[17px] font-bold text-text-primary">{room.title}</h3><p className="mt-1.5 text-sm leading-[1.65] text-text-secondary">{room.text}</p></figcaption>
              </figure>
            ))}
          </div>
          {equipment.length ? (
            <>
              <h3 className="mt-14 text-xl font-bold text-text-primary">Trang thiết bị</h3>
              <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
                {equipment.map((item, i) => (
                  <li className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 border-b border-border-subtle py-4" key={`${item.title}-${i}`}>
                    <ZoomImage className="aspect-square border border-border-subtle bg-white" fit="contain" gallery={facilityGallery} img={item.img} index={rooms.length + i} sizes="96px" />
                    <div><h4 className="text-[15px] font-bold text-text-primary">{item.title}</h4><p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.text}</p></div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </section>
    </>
  );
}
