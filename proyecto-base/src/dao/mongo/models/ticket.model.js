import mongoose from "mongoose";

// Define the collection name for the ticket
const ticketCollection = "ticket";

// Create the schema for the ticket
const ticketSchema = new mongoose.Schema({
  // Unique ticket code
  code: {
    type: String,
    required: true, // Mark code as required
    unique: true,   // Ensure code is unique
  },
  // Purchase date and time
  purchase_datetime: {
    type: Date,
    default: Date.now, // Use Date.now as a function (not a call)
  },
  // Total amount for the ticket
  amount: {
    type: Number,
    required: true, // Mark amount as required
    min: 0 // Ensure amount is non-negative
  },
  // Name of the purchaser
  purchaser: {
    type: String,
    required: true, // Mark purchaser as required
  },
});

// Create and export the ticket model using the ticket schema
export const ticketModel = mongoose.model(ticketCollection, ticketSchema);