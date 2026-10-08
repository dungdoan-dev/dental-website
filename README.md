# Dental Website

Website giới thiệu nha khoa được xây dựng bằng Next.js App Router, TypeScript, Tailwind CSS, Prisma và Zod. Nội dung hiển thị được đọc từ PostgreSQL/Supabase; các hằng số giao diện như bộ lọc và ca khám vẫn được quản lý trong code.

## Cài đặt

```bash
npm install
```

Sao chép `.env.example` thành `.env` và cập nhật biến môi trường khi cần.

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Prisma

```bash
npx prisma generate
```

Sau khi cấu hình `DATABASE_URL` và `DIRECT_URL`, chạy migration SQL trong Supabase Dashboard → SQL Editor:

1. Với database mới hoàn toàn, chạy `supabase/migrations/20251006_init.sql` một lần.
2. Với database đã có dữ liệu, **không chạy lại** file khởi tạo: file đó có `DROP TABLE`. Chỉ chạy `supabase/migrations/20261007_content_to_database.sql` để thêm nội dung còn thiếu mà không ghi đè chỉnh sửa trong admin.
3. Dừng server development (nếu đang chạy), rồi chạy `npm run prisma:generate` và khởi động lại server.

Không dùng `prisma db push` thay cho migration SQL này vì migration còn chứa dữ liệu trang Giới thiệu, Implant và đường dẫn logo bảo hiểm.

## Kiểm tra code

```bash
npm run typecheck
npm run lint
```

## Build

```bash
npm run build
```

## Đăng nhập admin

Chạy `npm run admin:credentials`, nhập mật khẩu tối thiểu 12 ký tự, rồi lưu `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` và `ADMIN_SESSION_SECRET` vào `.env.local` (không commit). Khởi động lại server và truy cập `/admin/login`. Khi chưa cấu hình đủ ba biến, admin sẽ không cho đăng nhập. Phiên đăng nhập hết hạn sau 8 giờ; nút **Đăng xuất** ở thanh trên cùng sẽ xóa cookie.

Tài khoản qua biến môi trường phù hợp cho một quản trị viên. Trước khi dùng công khai, cần HTTPS và giới hạn số lần thử đăng nhập ở tầng hạ tầng hoặc dịch vụ xác thực chuyên dụng.

## Cấu trúc chính

- `src/app`: routing, layout, page và API route.
- `src/components`: component UI, layout và component dùng chung.
- `src/features`: business domain, tổ chức theo component → service → repository → data.
- `src/lib`: hạ tầng và helper có mục đích cụ thể như Prisma, SEO, Cloudinary và mail.
- `src/config`: cấu hình website và navigation.
- `prisma`: database schema.

Các trang không truy vấn Prisma trực tiếp. Nội dung của trang Giới thiệu, chi tiết Implant và ảnh “Vì sao chọn” nằm trong bảng `site_content`; logo bảo hiểm nằm trong cột `insurance_partners.logo_src`. Dữ liệu dịch vụ, bác sĩ, bài viết, hero, FAQ và đánh giá đã nằm trong các bảng riêng.
