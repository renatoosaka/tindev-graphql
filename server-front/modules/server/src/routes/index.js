import express from "express";

const routes = express.Router();

routes.get("/", (_, res) => {
  res.json({ message: `Hello World` });
});

export default routes;
