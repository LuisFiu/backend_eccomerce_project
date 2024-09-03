import { CartService } from "../services/services.js";

export const CartExist = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await CartService.getCartById(cid);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "CART_NOT_FOUND", message: "Cart doesn't exist" });
    }

    req.cart = cart;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ status: "UNKNOWN_ERROR", message: "An unknown error occurred" });
  }
};
