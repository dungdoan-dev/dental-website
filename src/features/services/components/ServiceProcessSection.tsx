const processSteps = [
  { title: "Đặt Hẹn & Khám Ban Đầu", description: "Chủ động chọn thời gian và cơ sở thuận tiện; bác sĩ thăm khám tổng quát và lắng nghe nhu cầu của bạn." },
  { title: "Chụp Phim 3D Chẩn Đoán", description: "Hệ thống hình ảnh kỹ thuật số hỗ trợ đánh giá cấu trúc răng, xương hàm và khớp cắn một cách trực quan." },
  { title: "Phác Đồ & Báo Giá Trọn Gói", description: "Bác sĩ trình bày giải pháp phù hợp, giải thích ưu nhược điểm và công khai chi phí trước điều trị." },
  { title: "Điều Trị & Chăm Sóc Hậu Phẫu", description: "Quy trình vô khuẩn, theo dõi sát và hướng dẫn chăm sóc tại nhà giúp kết quả duy trì ổn định lâu dài." },
] as const;

export function ServiceProcessSection() {
  return (
    <section className="border-y border-border-subtle bg-background-secondary py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-green-dark">Quy trình chuẩn hóa</span><h2 className="mt-3 text-3xl font-bold text-brand-blue-dark md:text-4xl">Quy Trình Khám &amp; Tư Vấn Tinh Gọn</h2><p className="mt-4 leading-relaxed text-text-secondary">Minh bạch từng bước, cá nhân hóa theo tình trạng răng miệng và nhu cầu thực tế của mỗi khách hàng.</p></div>
        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-border-subtle lg:block" />
          {processSteps.map((step, index) => <li className="relative rounded-2xl border border-border-subtle bg-white p-6 shadow-sm" key={step.title}><span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-lg font-extrabold text-white shadow-md">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-5 text-lg font-bold text-brand-blue-dark">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p></li>)}
        </ol>
      </div>
    </section>
  );
}
