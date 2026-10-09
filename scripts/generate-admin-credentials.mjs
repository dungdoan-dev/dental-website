import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

const input = createInterface({ input: process.stdin, output: process.stdout });

try {
  const password = await input.question(
    "Nhập mật khẩu admin (tối thiểu 8 ký tự): ",
  );
  if (password.length < 8) {
    console.error("Mật khẩu phải có ít nhất 8 ký tự.");
    process.exitCode = 1;
  } else {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64);
    console.log(
      `ADMIN_PASSWORD_HASH=${salt.toString("hex")}:${hash.toString("hex")}`,
    );
    console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
    console.log(
      "Lưu các giá trị trên vào .env.local cùng ADMIN_USERNAME. Không commit file này.",
    );
  }
} finally {
  input.close();
}
