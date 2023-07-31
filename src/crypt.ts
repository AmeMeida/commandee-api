import bcrypt from "bcryptjs";

export async function encrypt(password: string) {
  return bcrypt.hash(password, 10);
}

export async function compare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
