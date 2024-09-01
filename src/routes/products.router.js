import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

const router = Router();

router.post(
  "/",
  Validator(["admin"], "Create Product"),
  productsController.create
);

router.get("/", Validator(["user"], "Get Products"), productsController.get);

router.get(
  "/:id",
  Validator(["user"], "Get Product By ID"),
  productsController.getById
);

router.put(
  "/:id",
  Validator(["admin"], "Update Product"),
  productsController.update
);

router.delete(
  "/:id",
  Validator(["admin"], "Delete Product"),
  productsController.deleteById
);

export default router;
