import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_GMAIL,
        pass: process.env.NODEMAILER_APP_PASS,
    },
});

export const sendMail = async (data: object, email: string, subject: string, template: string) => {

    const html = await ejs.renderFile(path.join(__dirname, '../mails', template), data)

    const mailOptions = {
        from: 'support@atick.com',
        to: email,
        subject: subject,
        html,
    }

    await transporter.sendMail(mailOptions)

}