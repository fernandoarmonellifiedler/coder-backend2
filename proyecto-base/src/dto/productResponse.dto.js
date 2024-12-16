// Data Transfer Object (DTO) for product response
export class ProductResponseDto {
  // Constructor that initializes the DTO with product details
  constructor(product) {
    // Map product properties to the DTO
    this.title = product.title;       // Product title
    this.category = product.category; // Product category
    this.stock = product.stock;       // Available stock quantity
    this.price = product.price;       // Product price
  }
}