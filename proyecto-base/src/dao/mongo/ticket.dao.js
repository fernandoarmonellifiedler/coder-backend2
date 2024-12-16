import { ticketModel } from "./models/ticket.model.js"; // Import the ticket model for database interactions.

class TicketDao {
  // Class responsible for data access operations related to tickets.

  // Method to get all tickets
  async getAll() {
    // Retrieves all ticket documents from the database.
    const tickets = await ticketModel.find();
    return tickets; // Returns the retrieved tickets.
  }

  // Method to get a ticket by its ID
  async getById(id) {
    // Fetches a ticket document from the database based on the provided ID.
    const ticket = await ticketModel.findById(id);
    return ticket; // Returns the found ticket or null if not found.
  }

  // Method to get a ticket by the associated email
  async getByEmail(email) {
    // Retrieves a ticket document based on the provided email and populates the associated cart.
    const ticket = await ticketModel.findOne({ email }).populate("cart");
    return ticket; // Returns the found ticket or null if not found.
  }

  // Method to create a new ticket
  async create(data) {
    // Creates a new ticket document in the database using the provided data.
    const ticket = await ticketModel.create(data);
    return ticket; // Returns the created ticket document.
  }

  // Method to update a ticket by its ID
  async update(id, data) {
    // Updates an existing ticket document with the provided data, based on the given ID.
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, data, { new: true });
    return ticketUpdate; // Returns the updated ticket document.
  }

  // Method to delete a ticket by its ID
  async deleteOne(id) {
    // Deletes a ticket document from the database based on the provided ID.
    const ticket = await ticketModel.deleteOne({ _id: id });
    return ticket; // Returns the result of the delete operation.
  }
}

// Instantiate the TicketDao class and export it for use in other parts of the application.
export const ticketDao = new TicketDao();