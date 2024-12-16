import { Router } from "express";
import { sendMail } from "../utils/sendEmail.js";
import { sendSMS } from "../utils/sendSMS.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, subject, to} = req.body;
  await sendMail(name, subject, to);
  res.send('Correo enviado')
  
})

router.get("/", async (req, res) => {
  await sendSMS()
  res.send('sms enviado')
  
})

export default router;