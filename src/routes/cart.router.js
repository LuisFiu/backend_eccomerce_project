import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

const router = Router();

router.post(
  "/",
  Validator(["admin", "user"], "Create Cart"),
  cartsController.create
);

router.get(
  "/:cid",
  Validator(["admin", "user"], "Get Cart by ID"),
  cartsController.getById
);

router.put(
  "/:cid/product/:pid",
  Validator(["user", "admin"], "Add Product to Cart"),
  cartsController.addProduct
);

router.put(
  "/:cid",
  Validator(["user", "admin"], "Update Cart Products"),
  cartsController.update
);

router.delete(
  "/:cid/product/:pid",
  Validator(["user", "admin"], "Delete Product from Cart"),
  cartsController.deleteProductById
);

router.delete(
  "/:cid",
  Validator(["user"], "Clear cart"),
  cartsController.clear
);

router.post(
  "/:cid/purchase",
  Validator(["user", "admin"], "Purchase"),
  cartsController.purchase
);

export default router;
