import nodemailer from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com"
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587")
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || '"Actinova Admin" <no-reply@actinova.ai>'

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: (SMTP_USER && SMTP_PASS) ? {
        user: SMTP_USER,
        pass: SMTP_PASS,
    } : undefined,
})

export async function sendVerificationEmail(email: string, code: string) {
    if (!SMTP_USER || !SMTP_PASS) {
        console.warn("SMTP credentials not provided. Logging verification code instead.")
        console.log(`[Email Mock] Verification code for ${email}: ${code}`)
        return
    }

    try {
        await transporter.sendMail({
            from: SMTP_FROM,
            to: email,
            subject: "Verify your Actinova Admin Account",
            text: `Your verification code is: ${code}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify your Admin Account</h2>
                    <p>Please use the following code to verify your email address:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${code}
                    </div>
                    <p>This code will expire in 24 hours.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        })
        console.log(`Verification email sent to ${email}`)
    } catch (error) {
        console.error("Error sending verification email:", error)
        // Fallback log
        console.log(`[Email Mock] Verification code for ${email}: ${code}`)
    }
}

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
    if (!SMTP_USER || !SMTP_PASS) {
        console.warn("SMTP credentials not provided. Logging reset link instead.")
        console.log(`[Email Mock] Password reset token for ${email}: ${token}`)
        return
    }

    const resetLink = `${baseUrl}/admin/auth/reset-password?token=${token}`

    try {
        await transporter.sendMail({
            from: SMTP_FROM,
            to: email,
            subject: "Reset your Password",
            text: `Click the link to reset your password: ${resetLink}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Password</h2>
                    <p>You requested a password reset. Click the button below to proceed:</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>Or copy this link: ${resetLink}</p>
                    <p>This link will expire in 1 hour.</p>
                </div>
            `,
        })
    } catch (error) {
        console.error("Error sending password reset email:", error)
        console.log(`[Email Mock] Password reset token for ${email}: ${token}`)
    }
}

export async function sendApprovalEmail(email: string, name: string, baseUrl: string) {
    if (!SMTP_USER || !SMTP_PASS) {
        console.warn("SMTP credentials not provided. Logging approval email.")
        console.log(`[Email Mock] Account approved for ${email}`)
        return
    }

    const dashboardLink = `${baseUrl}/admin`

    try {
        await transporter.sendMail({
            from: SMTP_FROM,
            to: email,
            subject: "Your Admin Account Has Been Approved! 🎉",
            text: `Welcome aboard, ${name}! Your account has been approved and you can now log in to the dashboard at ${dashboardLink}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome Aboard! 🚀</h1>
                    </div>
                    <div style="padding: 40px; color: #333333;">
                        <p style="font-size: 18px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                            Great news! Your administrator account for <strong>Actinova</strong> has been approved. You now have full access to the admin dashboard.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);">
                                Access Dashboard
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #888888; text-align: center;">
                             If the button doesn't work, copy this link:<br>
                            <a href="${dashboardLink}" style="color: #6366f1;">${dashboardLink}</a>
                        </p>
                    </div>
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                        &copy; ${new Date().getFullYear()} Actinova. All rights reserved.
                    </div>
                </div>
            `,
        })
    } catch (error) {
        console.error("Error sending approval email:", error)
        console.log(`[Email Mock] Account approved for ${email}`)
    }
}
