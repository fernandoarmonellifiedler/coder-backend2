import nodemailer from "nodemailer";
import envsConfig from "../config/envs.config.js";

export const sendMail = async (name, subject, to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "profeluismeradev@gmail.com",
      pass: envsConfig.GMAIL_PASS,
    },
  });

  // Configuramos el envió del correo electrónico

  await transporter.sendMail({
    from: "profeluismeradev@gmail.com",
    to: to,
    subject: subject,
    html: `<h1>Bienvenido ${name}</h1>
<div>
  <p>Este es un curso de Backend</p>
  <img src="cid:gatito" />
</div>`,
    attachments: [
      {
        filename: "gatito.jpg",
        path: "public/images/gatito.jpg",
        cid: "gatito",
      },
    ],
  });
};

export const sendTicketMail = async (to, ticket) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "profeluismeradev@gmail.com",
      pass: envsConfig.GMAIL_PASS,
    },
  });

  // Configuramos el envió del correo electrónico
  await transporter.sendMail({
    from: "profeluismeradev@gmail.com",
    to: to,
    subject: `Ticket de compra`,
    html: `<h1>Ticket de compra</h1>
<div>
  <p>Total de compra: ${ticket.amount}</p>
  <p>Código: ${ticket.code}</p>
</div>`,
  });
};
