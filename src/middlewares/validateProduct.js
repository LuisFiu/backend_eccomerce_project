import { ProductService } from "../services/services.js";

export const ProductExist = async (req, res, next) => {
  try {
    const pid = req.params.pid;

    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        error: "PRODUCT_NOT_FOUND",
        message: "Product doesn't exist",
      });
    }

    req.product = product;

    next();
  } catch (error) {
    return res.status(500).json({
      status: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
    });
  }
};
