
export class ProductResponseDto {
  constructor(product){
    this.title = product.title;
    this.category = product.category;
  }
}