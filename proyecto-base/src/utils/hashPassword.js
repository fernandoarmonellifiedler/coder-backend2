import bycrypt from "bcrypt";

// Function that hashes the password
export const createHash = (password) => {
  return bycrypt.hashSync(password, bycrypt.genSaltSync(10));
};

// Function that validates the password entered by the user against the encrypted password
export const isValidPassword = (password, userPassword) => {
  return bycrypt.compareSync(password, userPassword); // Compares the two passwords and returns true or false
};