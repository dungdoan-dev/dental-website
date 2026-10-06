import { Container } from "@/components/common/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFoundPage() {
  return <Container className="py-24 text-center"><p className="text-sm font-semibold text-teal-700">404</p><h1 className="mt-3 text-4xl font-bold">Không tìm thấy nội dung</h1><p className="mt-4 text-slate-600">Trang bạn đang tìm không tồn tại hoặc đã được thay đổi.</p><ButtonLink className="mt-8" href="/">Về trang chủ</ButtonLink></Container>;
}
