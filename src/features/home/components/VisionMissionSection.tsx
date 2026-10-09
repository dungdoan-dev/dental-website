import Image from "next/image";
import { VisionMissionReveal } from "./VisionMissionReveal";

export function VisionMissionSection() {
  return (
    <section className="bg-white pb-6 pt-8 lg:pb-8 lg:pt-10">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-center"><h2 className="text-center text-3xl font-extrabold uppercase tracking-wide text-text-primary sm:text-4xl md:text-5xl">TẦM NHÌN <span className="mx-1 inline-block -translate-y-1 text-4xl font-normal italic text-brand-blue sm:text-5xl md:text-6xl">&amp;</span> SỨ MỆNH</h2></div>
          <div className="w-full space-y-6">
            <VisionMissionReveal direction="left">
              <div className="relative flex flex-col items-stretch overflow-hidden rounded-2xl border-2 border-brand-blue-dark bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row"><div className="flex shrink-0 select-none items-center justify-center bg-brand-blue-dark px-4 py-2.5 text-white md:flex-col md:px-3.5 md:py-6"><span className="text-sm font-bold uppercase tracking-widest md:rotate-180 md:[writing-mode:vertical-lr]">TẦM NHÌN</span></div><div className="flex flex-1 flex-col items-center justify-between gap-6 p-6 sm:p-8 md:flex-row"><p className="flex-1 text-base leading-relaxed text-text-primary sm:text-lg">Tự hào với đội ngũ y bác sĩ có tay nghề chuyên môn cao; luôn cập nhật xu hướng mới nhất của ngành Nha thế giới. Nha Khoa 2000 hướng tới việc trở thành địa chỉ uy tín hàng đầu mà khách hàng nghĩ tới đầu tiên khi có nhu cầu tìm kiếm Nha Khoa chất lượng.</p><div className="flex h-44 w-full max-w-[280px] shrink-0 items-center justify-center md:w-5/12"><Image alt="Tầm nhìn Nha Khoa 2000" className="h-full w-full object-contain" height={286} src="/images/about/vision.jpg" width={512} /></div></div></div>
            </VisionMissionReveal>
            <VisionMissionReveal direction="right">
              <div className="relative flex flex-col items-stretch overflow-hidden rounded-2xl border-2 border-brand-green bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row"><div className="order-2 flex flex-1 flex-col items-center justify-between gap-6 p-6 sm:p-8 md:order-1 md:flex-row"><div className="order-2 flex h-44 w-full max-w-[280px] shrink-0 items-center justify-center md:order-1 md:w-5/12"><Image alt="Sứ mệnh Nha Khoa 2000" className="h-full w-full object-contain" height={286} src="/images/about/mission.jpg" width={512} /></div><p className="order-1 flex-1 text-base leading-relaxed text-text-primary sm:text-lg md:order-2"><em>Với phương châm “Coi bệnh nhân như người thân trong gia đình”</em>, mỗi cá nhân và tập thể tại Nha Khoa 2000 luôn ghi nhớ sứ mệnh cao cả của mình: mang lại giá trị tốt nhất cho khách hàng. Để hiện thực hóa sứ mệnh này, đội ngũ Nha Khoa 2000 không ngừng nỗ lực nâng cao tay nghề, thường xuyên cập nhật những công nghệ và phương pháp điều trị tiên tiến nhất. Đồng thời xây dựng một môi trường làm việc gắn kết và thân thiện, nơi mọi người đều cảm thấy như một gia đình.</p></div><div className="order-1 flex shrink-0 select-none items-center justify-center bg-brand-green px-4 py-2.5 text-white md:order-2 md:flex-col md:px-3.5 md:py-6"><span className="text-sm font-bold uppercase tracking-widest md:rotate-180 md:[writing-mode:vertical-lr]">SỨ MỆNH</span></div></div>
            </VisionMissionReveal>
          </div>
          <div className="pt-2 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">4 Giá Trị Tạo Dựng Niềm Tin Bền Vững</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
