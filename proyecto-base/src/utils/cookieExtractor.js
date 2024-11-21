export const cookieExtractor = (req) => {
  if (req?.cookies?.token) {
    return req.cookies.token;
  }
  return null;
};
