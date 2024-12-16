// Function to extract a specific cookie from the request object
export const cookieExtractor = (req) => {
  let token = null; // Initialize token as null.

  // Check if the request object and its cookies exist
  if (req && req.cookies) {
    token = req.cookies.token; // Extract the 'token' cookie if it exists.
  }

  return token; // Return the extracted token, or null if it was not found.
};