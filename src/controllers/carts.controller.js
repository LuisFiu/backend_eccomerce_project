import mongoose from "mongoose";
import {
  CartService,
  ProductService,
  TicketService,
  UserService,
} from "../services/services.js";

import getErrorDetails from "../services/errorService.js";

//Defino Origin para busqueda de errores posteriormente

const origin = "cart";

//Funciones para Base Router

const create = async (req, res) => {
  const result = await CartService.createCart();

  if (result < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({ status: "success", message: "Cart Created", cart: result });
};

const getById = async (req, res) => {
  const cartId = req.params.cid;

  const result = await CartService.getCartById(cartId);

  if (result < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({ status: "success", message: "Cart found", cart: result });
};

const addProduct = async (req, res) => {
  const quantity = req.body.quantity ?? 1;

  if (quantity < 0) {
    return res
      .status(400)
      .send({ status: "error", error: "Quantity cannot be a negative number" });
  }

  const cartId = req.params.cid;

  const productId = req.params.pid;

  const result = await CartService.addProductById(cartId, productId, quantity);

  if (result < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({
    status: "success",
    message: "Product added successfully",
    cart: result,
  });
};

const update = async (req, res) => {
  const updatedValues = req.body;

  if (!updatedValues || !Array.isArray(updatedValues)) {
    return res
      .status(400)
      .send({ status: "error", error: "Invalid data format" });
  }

  for (const product of updatedValues) {
    if (
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity < 0
    ) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid product format" });
    }

    if (!mongoose.Types.ObjectId.isValid(product.product)) {
      try {
        const objectId = mongoose.Types.ObjectId(product.product);
        product.product = objectId;
      } catch (error) {
        console.error("Error converting product.id to ObjectId:", error);
        return res
          .status(400)
          .send({ status: "error", error: "Invalid product format (id)" });
      }
    }
  }

  const cartId = req.params.cid;

  const result = await CartService.replaceProducts(cartId, updatedValues);

  if (result < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({
    status: "success",
    message: "Products in cart successfully updated",
    cart: result,
  });
};

const deleteProductById = async (req, res) => {
  const cartId = req.params.cid;

  const productId = req.params.pid;

  const result = await CartService.deleteProduct(cartId, productId);

  if (result < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({
    status: "success",
    message: "Product deleted successfully",
    cart: result,
  });
};

const clear = async (req, res) => {
  const cartId = req.params.cid;

  const result = await CartService.clearCart(cartId);

  if (result < 0) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({
    status: "success",
    message: "Cart cleaned successfully",
    cart: result,
  });
};

const purchase = async (req, res) => {
  const purchaserId = req.user.id;

  const purchaser = await UserService.getUser(purchaserId);

  if (purchaser === null || !purchaser.email) {
    return res
      .status(404)
      .send({ status: "error", message: "Couldn't complete purchase" });
  }

  const email = purchaser.email;

  const purchaserCart = req.params.cid;

  const foundedCart = await CartService.getCartById(purchaserCart);

  if (foundedCart < 0) {
    const { errorName, httpCode, message } = getErrorDetails(
      foundedCart,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const cartProducts = foundedCart.products;

  const inStock = [];
  const outOfStock = [];

  cartProducts.forEach((item) => {
    const { product, quantity } = item;

    if (product.stock >= quantity) {
      let amount = product.price * quantity;
      inStock.push({
        id: product._id,
        total: amount,
        quantity: quantity,
        stock: product.stock,
      });
    } else {
      outOfStock.push({
        id: product._id,
        quantity: quantity,
        available: product.stock,
      });
    }
  });

  if (outOfStock.length >= 1) {
    return res.status(406).send({
      status: "error",
      message: "Your cart has products out of stock",
      payload: outOfStock,
    });
  }

  if (inStock.length < 1) {
    return res.status(406).send({
      status: "error",
      message: "Couldn't complete purchase, your cart is empty",
      payload: outOfStock,
    });
  }

  let totalAmount;

  totalAmount = inStock.reduce((sum, product) => sum + product.total, 0);

  //Generar Ticket

  const ticket = await TicketService.create(totalAmount, email);

  // Actualizar stock

  inStock.forEach((product) => {
    let newStock = product.stock - product.quantity;
    let operation = ProductService.updateStock(product.id, newStock);

    if (operation < 0) {
      const { errorName, httpCode } = getErrorDetails(foundedCart);
      return res.status(httpCode).send({ status: "error", error: errorName });
    }
  });

  //Limpiar Carrito

  await CartService.clearCart(purchaserCart);

  //Enviar Ticket al Usuario

  res.status(201).send({
    status: "success",
    message: "Ticket created successfully",
    payload: ticket,
  });
};

export default {
  create,
  getById,
  addProduct,
  update,
  deleteProductById,
  clear,
  purchase,
};
