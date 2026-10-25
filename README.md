# Dental Website

Website nha khoa xây dựng bằng Next.js App Router, TypeScript, Tailwind CSS và Supabase. Ứng dụng truy cập dữ liệu qua Supabase Data API. `DATABASE_URL` chỉ cần khi chạy migration; API đặt lịch cần `SUPABASE_SERVICE_ROLE_KEY` ở server.

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Tạo `.env.local` từ `.env.example`, sau đó điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` từ Supabase Dashboard → Project Settings → API.

## Database và quyền truy cập

Các thay đổi schema/policy được quản lý bằng SQL trong `supabase/migrations`. Với database hiện có, chạy migration mới theo thứ tự sau các migration trước đó; **không chạy lại** `20261006000000_init.sql` trên database đã có dữ liệu vì file khởi tạo có thao tác xóa bảng.

`20261012201305_supabase_auth_admin_rls.sql` chuyển quyền quản trị sang Supabase Auth và RLS. Thao tác quản trị yêu cầu người dùng Supabase Auth có `app_metadata.role = "admin"`.

Hai migration tối ưu mới phải được áp dụng cùng đợt triển khai mã tương ứng:

1. `20261020152353_appointment_submission_guard.sql`: API server tiếp nhận lịch qua RPC có chống lặp, giới hạn gửi và hàng đợi thông báo. Thu hồi quyền ghi lịch trực tiếp bằng public key để tránh bỏ qua kiểm tra.
2. `20261020152834_atomic_admin_content_saves.sql`: lưu nội dung, các bảng chi tiết và lịch sử trong cùng transaction, giữ RLS và kiểm tra vai trò admin.

Chỉ chạy hai file mới trên database hiện có đã có các migration trước. Không dùng file khởi tạo để cập nhật production. Khi chưa áp dụng migration, các thao tác cần RPC mới sẽ chưa hoạt động; API đặt lịch trả 503 thay vì bỏ qua bảo vệ.

## Thông báo lịch hẹn

Lịch hẹn và thông báo chờ được ghi cùng giao dịch. Nếu chưa cấu hình email, lịch vẫn có trong admin và thông báo ở trạng thái chờ. Để gửi email qua Resend, điền `RESEND_API_KEY`, `APPOINTMENT_EMAIL_FROM` (địa chỉ/domain đã xác minh) và `APPOINTMENT_EMAIL_TO`.

API thử gửi sau khi đã trả kết quả đặt lịch. Cấu hình scheduler gọi `GET /api/appointments/notifications` mỗi phút với header `Authorization: Bearer <CRON_SECRET>` để xử lý lỗi tạm thời; cũng có nút “Gửi thông báo chờ” trong admin. Mỗi thông báo thử tối đa 5 lần, có thời gian chờ tăng dần và khóa chống gửi trùng. Trạng thái `sent` nghĩa là nhà cung cấp đã nhận email, chưa bảo đảm email vào hộp thư đích.

Giới hạn là 3 lịch/số điện thoại/giờ và (khi có proxy đáng tin cậy) 10 lịch/IP/10 phút. Chỉ bật `APPOINTMENT_TRUST_PROXY=true` nếu reverse proxy ghi đè `x-forwarded-for`; trên Vercel ứng dụng dùng header IP của Vercel. Không lưu IP thô.

## Đăng nhập quản trị

1. Trong Supabase Dashboard → Authentication → Users, tạo tài khoản quản trị bằng email và mật khẩu.
2. Đặt `app_metadata` của tài khoản thành `{ "role": "admin" }` trong dashboard.
3. Truy cập `/admin/login` và đăng nhập bằng email/mật khẩu. Nếu vừa thay đổi metadata, đăng xuất/đăng nhập lại để nhận JWT mới.

Không đặt service-role/secret key trong trình duyệt hoặc trong biến `NEXT_PUBLIC_*`. RLS kiểm tra quyền đọc/ghi ở database; không cấp quyền ghi công khai cho anon.

## Kiểm tra và build

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Ở local, `npm run dev` dùng `.next`, còn `npm run build` và `npm start` dùng `.next-production` để tránh tranh chấp file trên Windows. Dừng server production trước khi build lại vì server đó đang dùng chính thư mục build. Có thể đổi thư mục local bằng `NEXT_BUILD_DIR`, nhưng phải dùng cùng giá trị khi build và start. Trên Vercel (`VERCEL=1`), output luôn là `.next`; giữ Framework Preset là Next.js và không override Output Directory sang `.next-production`. Các test database dùng PostgreSQL cục bộ qua PGlite, không ghi vào Supabase đang chạy.

## Cấu trúc chính

- `src/app`: routes, layout, pages và API routes.
- `src/features`: các domain nội dung, dịch vụ, bác sĩ, lịch hẹn và quản trị.
- `src/lib/supabase`: client public và client server có cookie Auth.
- `supabase/migrations`: schema, dữ liệu khởi tạo và RLS policies.



hehe