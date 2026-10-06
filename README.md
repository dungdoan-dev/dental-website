# Dental Website

Website giới thiệu nha khoa được xây dựng bằng Next.js App Router, TypeScript, Tailwind CSS, Prisma và Zod. Phiên bản hiện tại tập trung vào cấu trúc nền tảng, dữ liệu mock và khả năng mở rộng.

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

Schema đã được chuẩn bị cho PostgreSQL. Chưa cần chạy migration hoặc seed ở giai đoạn này.

## Kiểm tra code

```bash
npm run typecheck
npm run lint
```

## Build

```bash
npm run build
```

## Cấu trúc chính

- `src/app`: routing, layout, page và API route.
- `src/components`: component UI, layout và component dùng chung.
- `src/features`: business domain, tổ chức theo component → service → repository → data.
- `src/lib`: hạ tầng và helper có mục đích cụ thể như Prisma, SEO, Cloudinary và mail.
- `src/config`: cấu hình website và navigation.
- `prisma`: database schema.

Các trang không truy vấn Prisma trực tiếp. Khi chuyển từ mock data sang PostgreSQL, phần repository là điểm cần thay đổi chính.
