import { v4 as uuid } from "uuid";
import { ticketDao } from "../dao/mongo/ticket.dao.js";
import { sendTicketMail } from "../utils/sendEmail.js";

class TicketService {
  async create(amount, userMail) {
    const newTicket = {
      code: uuid(),
      purchaser: userMail,
      amount,
    }
    const ticket = await ticketDao.create(newTicket);
    await sendTicketMail(userMail, ticket);
    return ticket;
  }
}

export const ticketService = new TicketService();