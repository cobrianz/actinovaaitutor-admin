
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"
import nodemailer from "nodemailer"

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { message, subject } = await request.json()

        // 1. Fetch contact
        const contactsCollection = await getCollection("contacts")
        let objectId
        try {
            objectId = new ObjectId(id)
        } catch (e) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
        }

        const contact = await contactsCollection.findOne({ _id: objectId })
        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 })
        }

        // 2. Configure Transporter
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
        const smtpPort = parseInt(process.env.SMTP_PORT || '587')
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        })

        let emailSent = false
        if (smtpUser && smtpPass) {
            try {
                const mailOptions = {
                    from: `"Actinova AI Tutor" <nonereply@actinovaaitutor.com>`,
                    to: contact.email,
                    subject: subject || `Re: ${contact.subject}`,
                    text: message,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 4px; padding: 30px; color: #333;">
                            <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Actinova AI Tutor - Support Response</h2>
                            
                            <div style="margin-bottom: 30px; font-size: 15px; line-height: 1.6;">
                                ${message.replace(/\n/g, "<br>")}
                            </div>
                            
                            <div style="background-color: #f8f8f8; border-left: 4px solid #eee; padding: 15px; margin-top: 30px;">
                                <p style="font-size: 12px; color: #777; margin: 0 0 10px 0; text-transform: uppercase; font-weight: bold;">Original Inquiry Details:</p>
                                <p style="font-size: 13px; color: #555; margin: 0; line-height: 1.4;">
                                    <strong>Subject:</strong> ${contact.subject}<br>
                                    <strong>Message:</strong> "${contact.message}"
                                </p>
                            </div>
                            
                            <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
                                This is an automated response from <strong>Actinova AI Tutor</strong> Support.<br>
                                &copy; 2025 Actinova AI Tutor.
                            </p>
                        </div>
                    `
                };
                await transporter.sendMail(mailOptions);
                emailSent = true;
            } catch (emailError) {
                console.error("Failed to send email:", emailError)
                return NextResponse.json({ error: "Failed to send email", details: emailError }, { status: 500 })
            }
        } else {
            console.log("Mocking email send (no credentials configured):", {
                to: contact.email,
                subject: subject,
                message: message
            })
            emailSent = true // Simulate success
        }

        // 4. Update Contact Status and Notes
        if (emailSent) {
            const timestamp = new Date().toISOString()
            const noteEntry = `[${timestamp}] Admin Response: ${message}\n`

            await contactsCollection.updateOne(
                { _id: objectId },
                {
                    $set: {
                        status: "in-progress",
                        updatedAt: timestamp,
                        adminNotes: (contact.adminNotes || "") + "\n\n" + noteEntry
                    },
                    $push: {
                        responseHistory: {
                            message,
                            timestamp,
                            sentBy: "admin"
                        }
                    }
                } as any
            )
        }

        return NextResponse.json({ success: true, message: "Response sent successfully" })

    } catch (error) {
        console.error("Error responding to contact:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
