import { v4 as uuid } from "uuid";
import { ticketDao } from "../dao/mongo/ticket.dao.js";

class TicketService {
  async create(amount, userMail) {
    const newTicket = {
      code: uuid(),
      purchaser: userMail,
      amount,
    }
    return await ticketDao.create(newTicket);
  }
}

export const ticketService = new TicketService();