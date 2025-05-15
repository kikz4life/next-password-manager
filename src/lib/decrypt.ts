import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!; // Must be 32 bytes

export function decrypt(encrypted: { iv: string; content: string }) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(encrypted.iv, "hex")
  );

  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

