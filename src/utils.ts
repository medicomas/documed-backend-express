import crypto from "node:crypto";

export function sha256(input: string) {
  // crea el aglrotimo
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}
