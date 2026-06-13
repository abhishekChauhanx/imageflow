export function generateOTP(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}

export function getOTPExpiry(): Date {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
}