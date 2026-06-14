export async function sendOTPEmail(
  email: string,
  otp: string,
  type: "signup" | "login"
) {
  const subject =
    type === "signup"
      ? "Verify your ImageFlow account"
      : "Your ImageFlow login code";

  const action = type === "signup" ? "verify your account" : "sign in";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.FROM_NAME || "ImageFlow",
        email: process.env.FROM_EMAIL!,
      },
      to: [{ email, name: email }],
      subject,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#0A0806;font-family:'Courier New',monospace;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0806;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#110E09;border:1px solid rgba(200,169,110,0.2);">

                  <tr>
                    <td style="padding:40px 40px 30px;border-bottom:1px solid rgba(200,169,110,0.1);">
                      <table width="100%">
                        <tr>
                          <td>
                            <div style="width:48px;height:48px;border:1px solid #C8A96E;display:inline-block;text-align:center;line-height:48px;">
                              <span style="font-size:14px;letter-spacing:2px;color:#C8A96E;font-weight:600;">IF</span>
                            </div>
                          </td>
                          <td align="right">
                            <span style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(200,169,110,0.5);">IMAGEFLOW</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:40px;">
                      <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C8A96E;margin:0 0 20px;">
                        Verification Code
                      </p>
                      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F0EBE0;margin:0 0 16px;line-height:1.2;">
                        Your one-time code
                      </h1>
                      <p style="font-size:13px;line-height:1.8;color:#8A8070;margin:0 0 36px;">
                        Use this code to ${action}.
                        It expires in <strong style="color:#C8A96E;">5 minutes</strong>.
                      </p>
                      <div style="background:#0A0806;border:1px solid rgba(200,169,110,0.3);padding:28px;text-align:center;margin-bottom:32px;">
                        <span style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;letter-spacing:12px;color:#C8A96E;">
                          ${otp}
                        </span>
                      </div>
                      <p style="font-size:11px;line-height:1.7;color:rgba(138,128,112,0.6);margin:0;border-top:1px solid rgba(200,169,110,0.08);padding-top:24px;">
                        If you didn't request this code, you can safely ignore this email.
                        Never share this code with anyone.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid rgba(200,169,110,0.08);">
                      <p style="font-size:10px;letter-spacing:1px;color:rgba(138,128,112,0.4);margin:0;text-align:center;">
                        © 2026 IMAGEFLOW · Visual Intelligence
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ Brevo email error:", error);
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  console.log("✅ Email sent via Brevo to:", email);
}