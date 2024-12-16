import { v4 as uuid } from "uuid"; // Import the UUID generation library for unique ticket code creation.
import { ticketDao } from "../dao/mongo/ticket.dao.js"; // Import the ticket data access object.

class TicketService {
  // Creates a new ticket with the specified amount and purchaser's email
  async create(amount, userMail) {
    const newTicket = {
      code: uuid(), // Generate a unique code for the ticket.
      purchaser: userMail, // Assign the purchaser's email.
      amount, // Assign the ticket amount.
    };
    return await ticketDao.create(newTicket); // Delegate the ticket creation to the DAO and return the result.
  }
}

// Export an instance of TicketService for use in the application.
export const ticketService = new TicketService();