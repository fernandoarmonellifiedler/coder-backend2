import { cartDao } from "../dao/mongo/cart.dao.js";
import { productDao } from "../dao/mongo/product.dao.js";

class CartService {
  async createCart() {
    return await cartDao.create();
  }

  async getCartById(id) {
    const cart = await cartDao.getById(id);
    if (!cart) return null;
    return cart;
  }

  async addProductToCart(cid, pid) {
    const cart = await cartDao.getById(cid);
    if (!cart) return null;

    const productInCart = cart.products.find((element) => element.product == pid);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    return await cartDao.update(cid, cart);
  }

  async deleteProductToCart(cid, pid) {
    const products = cart.products.filter((prod) => prod.product != pid);

    return await cartDao.update(cid, { products });
  }

  async updateQuantityProductInCart(cid, pid, quantity) {
    const cart = await this.getCartById(cid);
    const index = cart.products.findIndex((element) => element.product == pid);
    cart.products[index].quantity = quantity;

    return await cartDao.update(cid, cart);
  }

  async clearProductsToCart(id) {
    const cart = await this.getCartById(id);
    cart.products = [];
    return await cartDao.update(id, cart);
  }

  async purchaseCart(id) {
    const cart = await this.getCartById(id);

    let total = 0;

    const products = [];

    for (const productCart of cart.products) {
      const prod = await productDao.getById(productCart.product);

      if (prod.stock >= productCart.quantity) {
        total += prod.price * productCart.quantity;
        
        prod.stock = prod.stock - productCart.quantity;
        await productDao.update(prod._id, { stock: prod.stock });
      } else {
        products.push(productCart);
      }

    }
    await cartDao.update(id, { products });

    return total;
  }
}

export const cartService = new CartService();
