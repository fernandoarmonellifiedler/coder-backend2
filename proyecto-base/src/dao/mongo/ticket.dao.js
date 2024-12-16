import { ticketModel } from "./models/ticket.model.js";

class TicketDao {
  async getAll() {
    const tickets = await ticketModel.find();
    return tickets;
  }

  async getById(id) {
    const ticket = await ticketModel.findById(id);
    return ticket;
  }

  async getByEmail(email) {
    const ticket = await ticketModel.findOne({ email }).populate("cart");
    return ticket;
  }

  async create(data) {
    const ticket = await ticketModel.create(data);
    return ticket;
  }

  async update(id, data) {
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return ticketUpdate;
  }

  async deleteOne(id) {
    const ticket = await ticketModel.deleteOne({ _id: id });
    return ticket;
  }
}

export const ticketDao = new TicketDao();
