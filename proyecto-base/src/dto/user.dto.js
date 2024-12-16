// Data Transfer Object (DTO) for user response
export class UserResponseDto {
  // Constructor that initializes the DTO with user details
  constructor(user) {
    // Map user properties to the DTO
    this.first_name = user.first_name;  // User's first name
    this.last_name = user.last_name;    // User's last name
    this.email = user.email;            // User's email address
    this.cart = user.cart;              // User's shopping cart
    this.age = user.age;                // User's age
    this.role = user.role;              // User's role in the system
    // Compute full name from first and last name
    this.full_name = `${user.first_name} ${user.last_name}`; // User's full name
  }
}