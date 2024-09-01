import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";
import ProductsRouter from "./routes/products.router.js";
import CartRouter from "./routes/cart.router.js";
import SessionRouter from "./routes/sessions.router.js";
import initializePassportConfig from "./config/passport.config.js";
import config from "./config/config.js";

// Start Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cookieParser());

// Set up view engine
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Initialize Passport
initializePassportConfig();
app.use(passport.initialize());

// Define routes
app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartRouter);
app.use("/api/sessions", SessionRouter);

// Database connection
const CONNECTION_STRING = config.app.MONGO.URL;
mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
