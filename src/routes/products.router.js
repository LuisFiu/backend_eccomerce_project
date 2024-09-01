import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

const router = Router();

router.post(
  "/",
  Validator(["admin", "user"], "Create Product"),
  productsController.create
);

router.get(
  "/",
  Validator(["admin", "user"], "Get Products"),
  productsController.get
);

router.get(
  "/:id",
  Validator(["admin", "user"], "Get Product By ID"),
  productsController.getById
);

router.put(
  "/:id",
  Validator(["admin", "user"], "Update Product"),
  productsController.update
);

router.delete(
  "/:id",
  Validator(["admin", "user"], "Delete Product"),
  productsController.deleteById
);

export default router;
