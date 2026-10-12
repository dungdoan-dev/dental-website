# Dental Website

Website nha khoa xây dựng bằng Next.js App Router, TypeScript, Tailwind CSS và Supabase. Ứng dụng truy cập dữ liệu qua Supabase Data API; runtime không cần `DATABASE_URL`, `DIRECT_URL` hay khóa service-role.

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Tạo `.env.local` từ `.env.example`, sau đó điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` từ Supabase Dashboard → Project Settings → API.

## Database và quyền truy cập

Các thay đổi schema/policy được quản lý bằng SQL trong `supabase/migrations`. Với database hiện có, chạy migration mới theo thứ tự sau các migration trước đó; **không chạy lại** `20251006_init.sql` trên database đã có dữ liệu vì file khởi tạo có thao tác xóa bảng.

`20261012_supabase_auth_admin_rls.sql` chuyển quyền quản trị sang Supabase Auth và RLS. Public key chỉ được phép đọc dữ liệu công khai và tạo lịch hẹn; thao tác quản trị yêu cầu người dùng Supabase Auth có `app_metadata.role = "admin"`.

## Đăng nhập quản trị

1. Trong Supabase Dashboard → Authentication → Users, tạo tài khoản quản trị bằng email và mật khẩu.
2. Đặt `app_metadata` của tài khoản thành `{ "role": "admin" }` trong dashboard.
3. Truy cập `/admin/login` và đăng nhập bằng email/mật khẩu. Nếu vừa thay đổi metadata, đăng xuất/đăng nhập lại để nhận JWT mới.

Không đặt service-role/secret key trong trình duyệt hoặc trong biến `NEXT_PUBLIC_*`. RLS kiểm tra quyền đọc/ghi ở database; không cấp quyền ghi công khai cho anon.

## Kiểm tra và build

```bash
npm run typecheck
npm run lint
npm run build
```

## Cấu trúc chính

- `src/app`: routes, layout, pages và API routes.
- `src/features`: các domain nội dung, dịch vụ, bác sĩ, lịch hẹn và quản trị.
- `src/lib/supabase`: client public và client server có cookie Auth.
- `supabase/migrations`: schema, dữ liệu khởi tạo và RLS policies.
