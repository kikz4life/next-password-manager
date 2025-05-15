import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string; // Must be 32 bytes

if(!secretKey) console.error("Missing secretKey");

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16); // Generate per encryption

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted
  };
}