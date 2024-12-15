export class UserResponseDto {
  constructor(user){
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.cart = user.cart;
    this.age = user.age;
    this.role = user.role;
    this.full_name = `${user.first_name} ${user.last_name}`
  }
}