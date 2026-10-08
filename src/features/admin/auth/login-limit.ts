import "server-only";
import { db } from "@/lib/db";

const key = "admin-login";
const limit = 10;

// One account-wide bucket cannot be bypassed by changing usernames or spoofing IP headers.
// Atomic PostgreSQL UPSERT works across multiple server instances and concurrent requests.
export async function reserveLoginAttempt(): Promise<boolean> {
  const rows = await db.$queryRaw<{ attempts: number }[]>`
    INSERT INTO admin_login_limits (key, attempts, reset_at)
    VALUES (${key}, 1, NOW() + INTERVAL '15 minutes')
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN admin_login_limits.reset_at <= NOW() THEN 1 ELSE LEAST(admin_login_limits.attempts + 1, ${limit + 1}) END,
      reset_at = CASE WHEN admin_login_limits.reset_at <= NOW() THEN NOW() + INTERVAL '15 minutes' ELSE admin_login_limits.reset_at END
    RETURNING attempts
  `;
  return rows.length === 1 && rows[0].attempts <= limit;
}

export async function clearLoginAttempts() {
  await db.adminLoginLimit.deleteMany({ where: { key } });
}
