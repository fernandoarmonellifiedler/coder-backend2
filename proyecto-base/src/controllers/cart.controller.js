import { cartService } from "../services/cart.service.js"; // Importing the cart service for handling cart-related operations.
import { productService } from "../services/product.service.js"; // Importing the product service to manage product data.
import { ticketService } from "../services/ticket.service.js"; // Importing the ticket service for handling ticket creation.

export class CartController {
  // Defines the CartController class that manages cart operations.

  async createCart(req, res) {
    // Creates a new shopping cart.
    try {
      const cart = await cartService.createCart(); // Calls the cart service to create a new cart.
      res.status(201).json({ status: "success", cart }); // Sends a response with status 201 and the created cart.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async getCartById(req, res) {
    // Retrieves a shopping cart by its ID.
    try {
      const { cid } = req.params; // Extracts the cart ID from the request parameters.
      const cart = await cartService.getCartById(cid); // Calls service to get cart by ID.
      if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" }); // Sends error if cart does not exist.
      res.status(200).json({ status: "success", cart }); // Sends the retrieved cart in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async addProductToCart(req, res) {
    // Adds a product to a specific shopping cart.
    try {
      const { cid, pid } = req.params; // Extracts the cart ID and product ID from the request parameters.
      await this.validateProduct(pid); // Validates the existence of the product.
      const cart = await cartService.addProductToCart(cid, pid); // Calls service to add the product to the cart.
      if (!cart) return res.status(404).json({ status: "Error", msg: `Cart not found with id ${cid}` }); // Sends error if cart does not exist.
      res.status(200).json({ status: "success", payload: cart }); // Sends the updated cart in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async deleteProductToCart(req, res) {
    // Removes a product from a specific shopping cart.
    try {
      const { cid, pid } = req.params; // Extracts the cart ID and product ID from the request parameters.
      await this.validateProduct(pid); // Validates the existence of the product.
      await this.validateCart(cid); // Validates the existence of the cart.
      const cartUpdate = await cartService.deleteProductToCart(cid, pid); // Calls service to remove the product from the cart.
      res.status(200).json({ status: "success", payload: cartUpdate }); // Sends the updated cart in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async updateQuantityProductInCart(req, res) {
    // Updates the quantity of a specific product in the shopping cart.
    try {
      const { cid, pid } = req.params; // Extracts the cart ID and product ID from the request parameters.
      const { quantity } = req.body; // Retrieves the quantity to update from the request body.
      await this.validateProduct(pid); // Validates the existence of the product.
      await this.validateCart(cid); // Validates the existence of the cart.
      const cartUpdate = await cartService.updateQuantityProductInCart(cid, pid, Number(quantity)); // Calls service to update product quantity in cart.
      res.status(200).json({ status: "success", payload: cartUpdate }); // Sends the updated cart in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async clearProductsToCart(req, res) {
    // Clears all products from a specific shopping cart.
    try {
      const { cid } = req.params; // Extracts the cart ID from the request parameters.
      const cart = await cartService.clearProductsToCart(cid); // Calls service to clear products in the cart.
      if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" }); // Sends error if cart does not exist.
      res.status(200).json({ status: "success", cart }); // Sends the cleared cart in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async purchaseCart(req, res) {
    // Processes the purchase of items in the shopping cart.
    try {
      const { cid } = req.params; // Extracts the cart ID from the request parameters.
      const cart = await cartService.getCartById(cid); // Calls service to get the cart by ID.
      if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" }); // Sends error if cart does not exist.
      const total = await cartService.purchaseCart(cid); // Calls service to process the cart purchase.
      if (total === 0) return res.status(400).json({ status: "Error", msg: "Insufficient stock to purchase the products" }); // Sends error if total is zero.
      const ticket = await ticketService.create(total, req.user.email); // Calls service to create a ticket for the purchase.
      res.status(200).json({ status: "success", ticket }); // Sends the purchase ticket in response with status 200.
    } catch (error) {
      this.handleError(res, error); // Handles errors using a custom error handler.
    }
  }

  async validateProduct(pid) {
    // Validates if a product exists.
    const product = await productService.getById(pid); // Calls service to get product by ID.
    if (!product) throw new Error(`Product not found with id ${pid}`); // Throws an error if the product does not exist.
  }

  async validateCart(cid) {
    // Validates if a cart exists.
    const cart = await cartService.getCartById(cid); // Calls service to get cart by ID.
    if (!cart) throw new Error(`Cart not found with id ${cid}`); // Throws an error if the cart does not exist.
  }

  handleError(res, error) {
    // Custom error handler function.
    console.log(error); // Logs the error to the console.
    res.status(500).json({ status: "Error", msg: "Internal server error" }); // Sends a generic error response with status 500.
  }
}

export const cartController = new CartController(); // Exports an instance of the CartController class.