import { cartDao } from "../dao/mongo/cart.dao.js";

class CartService {
  async addProductToCart(cid, pid) {
    const cart = await cartDao.getById(cid);
    if(!cart) return null;
    
    const productInCart = cart.products.find((element) => element.product == pid);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const productUpdate = await cartDao.update(cid, cart);
    return productUpdate;
  }
}

export const cartService = new CartService();