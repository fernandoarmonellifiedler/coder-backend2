import { Router } from "express";

const router = Router();

//Setear una cookie
router.get("/setCookie", (req, res) => {
  res
    .cookie("cookieName", "Info en la cookie", { maxAge: 100000 })
    .send("Cookie Seteada");
});

//Obtener la cookie
router.get("/getCookie", (req, res) => {
  const cookie = req.cookies.cookieName;
  res.send(`El valor de la cookie es: ${cookie}`);
});

//Limpiar las cookies
router.get("/deleteCookie", (req, res) => {
  res.clearCookie("cookieName").send("Cookie eliminada");
});

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/setdata", (req, res) => {
  const { user, email } = req.body;
  // Guardamos la información en la cookie
  res
    .cookie("user", { user, email }, { maxAge: 10000, signed: true })
    .send("Cookie Guardada");
});

router.get("/getdata", (req, res) => {
  const cookie = req.signedCookies.user;

  res.send(cookie);
});

export default router;
