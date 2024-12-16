import { cartDao } from "../dao/mongo/cart.dao.js"; // Import the cart data access object.
import { productDao } from "../dao/mongo/product.dao.js"; // Import the product data access object.

class CartService {
  // Creates a new cart
  async createCart() {
    return await cartDao.create(); // Delegate creation to the cart data access object.
  }

  // Retrieves a cart by its ID
  async getCartById(id) {
    const cart = await cartDao.getById(id); // Fetch the cart using its ID.
    return cart || null; // Return the cart, or null if it doesn't exist.
  }

  // Adds a product to the specified cart
  async addProductToCart(cid, pid) {
    const cart = await cartDao.getById(cid); // Get the cart by its ID.
    if (!cart) return null; // Return null if the cart does not exist.

    const productInCart = cart.products.find((element) => element.product == pid); // Check if the product is already in the cart.

    if (productInCart) {
      productInCart.quantity++; // Increase quantity if product exists.
    } else {
      cart.products.push({ product: pid, quantity: 1 }); // Add the product if it does not exist.
    }

    return await cartDao.update(cid, cart); // Update the cart in the database.
  }

  // Deletes a product from the specified cart
  async deleteProductToCart(cid, pid) {
    const cart = await this.getCartById(cid); // Get the cart by its ID.
    if (!cart) return null; // Return null if the cart does not exist.

    const products = cart.products.filter((prod) => prod.product != pid); // Filter out the product to delete.
    return await cartDao.update(cid, { products }); // Update the cart with the remaining products.
  }

  // Updates the quantity of a product in the specified cart
  async updateQuantityProductInCart(cid, pid, quantity) {
    const cart = await this.getCartById(cid); // Get the cart by ID.
    const index = cart.products.findIndex((element) => element.product == pid); // Find the product index.

    if (index !== -1) {
      cart.products[index].quantity = quantity; // Update the product quantity.
      return await cartDao.update(cid, cart); // Save the changes to the database.
    }
    return null; // Return null if the product is not found in the cart.
  }

  // Clears all products from the specified cart
  async clearProductsToCart(id) {
    const cart = await this.getCartById(id); // Get the cart by ID.
    cart.products = []; // Empty the products array.
    return await cartDao.update(id, cart); // Update the cart in the database.
  }

  // Processes the purchase for a specified cart
  async purchaseCart(id) {
    const cart = await this.getCartById(id); // Fetch the cart.
    let total = 0; // Initialize total price.
    const products = []; // Array to keep track of products not purchased.

    for (const productCart of cart.products) {
      const prod = await productDao.getById(productCart.product); // Get the product details.

      if (prod.stock >= productCart.quantity) {
        total += prod.price * productCart.quantity; // Calculate the total price.
        prod.stock -= productCart.quantity; // Decrease stock.
        await productDao.update(prod._id, { stock: prod.stock }); // Update product stock in the database.
      } else {
        products.push(productCart); // Add to unfulfilled products if not enough stock.
      }
    }
    await cartDao.update(id, { products }); // Update the cart with remaining products.
    return total; // Return the total price of the purchase.
  }
}

// Export an instance of CartService for use in the application.
export const cartService = new CartService();