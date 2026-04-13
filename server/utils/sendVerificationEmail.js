const { Resend } = require("resend");
require("dotenv").config();


const resend = new Resend(process.env.RESEND_API_KEY);
// 
const sendVerificationEmail = async (email, code) => {
    try {
        await resend.emails.send({
            from: `Loomaze <${process.env.RESEND_VERIFICATION_EMAIL}>`,
            to: email,
            subject: "Email Verification - Loomaze",
            html: `
                <div style="font-family: Arial, sans-serif">
                    <h2>Email Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color:#4CAF50">${code}</h1>
                    <p>If you didn’t request this, ignore this email.</p>
                </div>
            `,
        });
    } catch (err) {
        console.error("Resend error:", err);
        throw new Error("Email sending failed");
    }
};

module.exports = { sendVerificationEmail };