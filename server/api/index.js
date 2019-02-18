const authRouter = require("./auth");
const primetrustRouter = require("./primetrust");
const systemRouter = require("./system");

const initRoutes = app => {
  const api = require("express").Router();
  app.use("/api", api);
  // routers
  api.use("/auth", authRouter);
  api.use("/primetrust", primetrustRouter);
  api.use("/system", systemRouter);
};

module.exports = initRoutes;
