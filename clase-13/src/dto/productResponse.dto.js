
export class ProductResponseDto {
  constructor(product){
    this.title = product.title;
    this.category = product.category;
    this.stock = product.stock;
    this.price = product.price;
  }
}