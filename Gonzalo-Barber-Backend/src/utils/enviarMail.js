import nodemailer from 'nodemailer'
import { MAIL_USER, MAIL_PASS } from '../config/config.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: MAIL_USER, pass: MAIL_PASS }
})

export async function enviarMail ({ para, asunto, html }) {
  await transporter.sendMail({
    from: `"Gonzalo Barber" <${MAIL_USER}>`,
    to: para,
    subject: asunto,
    html
  })
}