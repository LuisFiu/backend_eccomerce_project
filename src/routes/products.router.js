import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { Validator } from "../middlewares/credentialsValidator.js";

import { ProductExist } from "../middlewares/validateProduct.js";

const router = Router();

router.post(
  "/",
  Validator(["admin"], "Create Product"),
  productsController.create
);

router.get("/", Validator(["user"], "Get Products"), productsController.get);

router.get(
  "/:pid",
  Validator(["user"], "Get Product By ID"),
  ProductExist,
  productsController.getById
);

router.put(
  "/:pid",
  Validator(["admin"], "Update Product"),
  ProductExist,
  productsController.update
);

router.delete(
  "/:pid",
  Validator(["admin"], "Delete Product"),
  ProductExist,
  productsController.deleteById
);

export default router;
