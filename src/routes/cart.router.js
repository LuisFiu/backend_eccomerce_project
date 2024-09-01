import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

const router = Router();

router.post("/", Validator(["admin"], "Create Cart"), cartsController.create);

router.get(
  "/:cid",
  Validator(["user"], "Get Cart by ID"),
  cartsController.getById
);

router.put(
  "/:cid/product/:pid",
  Validator(["user"], "Add Product to Cart"),
  cartsController.addProduct
);

router.put(
  "/:cid",
  Validator(["user"], "Update Cart Products"),
  cartsController.update
);

router.delete(
  "/:cid/product/:pid",
  Validator(["user"], "Delete Product from Cart"),
  cartsController.deleteProductById
);

router.delete(
  "/:cid",
  Validator(["user"], "Clear cart"),
  cartsController.clear
);

router.post(
  "/:cid/purchase",
  Validator(["user"], "Purchase"),
  cartsController.purchase
);

export default router;
