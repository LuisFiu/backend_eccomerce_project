import mongoose from "mongoose";
import {
  CartService,
  ProductService,
  TicketService,
  UserService,
} from "../services/services.js";

import getErrorDetails from "../services/errorService.js";
import { makeid } from "../utils.js";

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

  let operationResult;

  if (result == []) {
    operationResult = -4;
  }

  if (result < 0 || result === null) {
    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({
    status: "success",
    message: "Cart found",
    cart: result,
  });
};

const addProduct = async (req, res) => {
  let operationResult;

  const quantity = req.body.quantity ?? 1;

  if (quantity < 0) {
    return res
      .status(400)
      .send({ status: "error", error: "Quantity cannot be a negative number" });
  }

  const cartId = req.params.cid;

  const productId = req.params.pid;

  const cart = await CartService.getCartById({ _id: cartId });

  if (cart === null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const foundProduct = await ProductService.getProductById({ _id: productId });

  if (foundProduct === null) {
    operationResult = -3;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const productInCart = cart.products.find((p) => p.product.equals(productId));

  if (productInCart) {
    await CartService.updateById(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": quantity } }
    );
  } else {
    await CartService.updateById(
      { _id: cartId },
      { $push: { products: { product: productId, quantity: quantity } } }
    );
  }

  const updatedCart = await CartService.getCartById({ _id: cartId });

  const populateCart = await CartService.populate(updatedCart);

  res.send({
    status: "success",
    message: "Product added successfully",
    cart: populateCart,
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

  const cart = await CartService.getCartById({ _id: cartId });

  if (cart === null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const productIds = updatedValues.map((product) => product.product);

  const products = await ProductService.find({
    _id: { $in: productIds },
  });

  if (products.length !== products.length) {
    operationResult = -3;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const updateCart = await CartService.updateById(
    { _id: cartId },
    { $set: { products: updatedValues } }
  );

  if (updateCart === null) {
    operationResult = null;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const updatedCart = await CartService.getCartById(cartId);

  const populateCart = await CartService.populate(updatedCart);

  res.send({
    status: "success",
    message: "Products in cart successfully updated",
    cart: populateCart,
  });
};

const deleteProductById = async (req, res) => {
  let operationResult;

  const cartId = req.params.cid;

  const productId = req.params.pid;

  const cart = await CartService.getCartById({ _id: cartId });

  if (cart === null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const product = await ProductService.getProductById(productId);

  if (product === null) {
    operationResult = -3;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const productInCart = await CartService.find({
    _id: cartId,
    "products.product": productId,
  });

  console.log(productInCart);

  if (productInCart.length < 1) {
    operationResult = -5;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const updateCart = await CartService.updateById(
    { _id: cartId },
    { $pull: { products: { product: productId } } }
  );

  const updatedCart = await CartService.getCartById(cartId);

  const populateCart = await CartService.populate(updatedCart);

  res.send({
    status: "success",
    message: "Product deleted successfully",
    cart: populateCart,
  });
};

const clear = async (req, res) => {
  let operationResult;

  const cartId = req.params.cid;

  const cart = await CartService.getCartById({ _id: cartId });

  if (cart === null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const result = await CartService.clearCart(cartId);

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

  const purchase_datetime = new Date().toISOString();

  const purchaseInfo = {
    amount: totalAmount,
    purchaser: email,
    purchase_datetime,
    code: makeid(25),
  };

  const ticket = await TicketService.create(purchaseInfo);

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
