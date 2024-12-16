
import twilio from "twilio";

export const sendSMS = async () => {
  const accountSid = '';
  const authToken = '';
  
  const client = twilio(accountSid, authToken);

  await client.messages.create({
    body: "Hola desde coder",
    from:"",
    to:""
  })
} 