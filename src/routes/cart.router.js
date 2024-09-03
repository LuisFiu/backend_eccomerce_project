import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

import { CartExist } from "../middlewares/validateCart.js";
import { ProductExist } from "../middlewares/validateProduct.js";

const router = Router();

router.post("/", Validator(["admin"], "Create Cart"), cartsController.create);

router.get(
  "/:cid",
  Validator(["user"], "Get Cart by ID"),
  CartExist,
  cartsController.getById
);

router.put(
  "/:cid/product/:pid",
  Validator(["user"], "Add Product to Cart"),
  CartExist,
  ProductExist,
  cartsController.addProduct
);

router.put(
  "/:cid",
  Validator(["user"], "Update Cart Products"),
  CartExist,
  cartsController.update
);

router.delete(
  "/:cid/product/:pid",
  Validator(["user"], "Delete Product from Cart"),
  CartExist,
  ProductExist,
  cartsController.deleteProductById
);

router.delete(
  "/:cid",
  Validator(["user"], "Clear cart"),
  CartExist,
  cartsController.clear
);

router.post(
  "/:cid/purchase",
  Validator(["user"], "Purchase"),
  CartExist,
  cartsController.purchase
);

export default router;
