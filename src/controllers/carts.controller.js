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

// Funcion para errores

async function handleError(error, res) {
  const { errorName, message, httpCode } = getErrorDetails(error, origin);
  return res.status(httpCode).json({ error: errorName, message });
}

// Const para Exportar

const create = async (req, res) => {
  const result = await CartService.createCart();

  if (!result) {
    return handleError(-1, res);
  }

  res.json({ status: "success", message: "Cart Created", cart: result });
};

const getById = async (req, res) => {
  const cart = req.cart;

  res.json({
    status: "success",
    message: "Cart found",
    cart: cart,
  });
};

const addProduct = async (req, res) => {
  const quantity = req.body.quantity ?? 1;

  if (quantity < 0) {
    return res
      .status(400)
      .json({ status: "error", error: "Quantity cannot be a negative number" });
  }

  const cartId = req.params.cid;
  const cart = req.cart;

  const productId = req.params.pid;
  const foundProduct = req.product;

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

  res.json({
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
      .json({ status: "error", error: "Invalid data format" });
  }

  for (const product of updatedValues) {
    if (
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity < 0
    ) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid product format" });
    }

    if (!mongoose.Types.ObjectId.isValid(product.product)) {
      try {
        const objectId = mongoose.Types.ObjectId(product.product);
        product.product = objectId;
      } catch (error) {
        console.error("Error converting product.id to ObjectId:", error);
        return res
          .status(400)
          .json({ status: "error", error: "Invalid product format (id)" });
      }
    }
  }

  const cartId = req.params.cid;

  const productIds = updatedValues.map((product) => product.product);

  const products = await ProductService.find({
    _id: { $in: productIds },
  });

  if (products.length !== productIds.length) {
    return handleError(-3, res);
  }

  const updateCart = await CartService.updateById(
    { _id: cartId },
    { $set: { products: updatedValues } }
  );

  if (!updateCart) {
    return handleError(null, res);
  }

  const updatedCart = await CartService.getCartById(cartId);

  const cart = await CartService.populate(updatedCart);

  res.json({
    status: "success",
    message: "Products in cart successfully updated",
    cart: cart,
  });
};

const deleteProductById = async (req, res) => {
  const cartId = req.params.cid;

  const productId = req.params.pid;

  const productInCart = await CartService.find({
    _id: cartId,
    "products.product": productId,
  });

  console.log(productInCart);

  if (productInCart.length < 1) {
    return handleError(-5, res);
  }

  await CartService.updateById(
    { _id: cartId },
    { $pull: { products: { product: productId } } }
  );

  const updatedCart = await CartService.getCartById(cartId);

  const populateCart = await CartService.populate(updatedCart);

  res.json({
    status: "success",
    message: "Product deleted successfully",
    cart: populateCart,
  });
};

const clear = async (req, res) => {
  const cartId = req.params.cid;

  const cart = req.cart;

  const result = await CartService.clearCart(cartId);

  res.json({
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
      .json({ status: "error", message: "Couldn't complete purchase" });
  }

  const email = purchaser.email;

  const purchaserCart = req.params.cid;

  const foundedCart = req.cart;

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
    return res.status(406).json({
      status: "error",
      message: "Your cart has products out of stock",
      payload: outOfStock,
    });
  }

  if (inStock.length < 1) {
    return res.status(406).json({
      status: "error",
      message: "Couldn't complete purchase, your cart is empty",
      payload: outOfStock,
    });
  }

  const totalAmount = inStock.reduce((sum, product) => sum + product.total, 0);

  //Generar Ticket

  const purchase_datetime = new Date().toISOString();

  const purchaseInfo = {
    amount: totalAmount,
    purchaser: email,
    purchase_datetime,
    code: makeid(25),
  };

  const ticket = await TicketService.create(purchaseInfo);

  if (!ticket) {
    return res.status(500).json({
      status: "error",
      error: "ERROR_CREATING_TICKET",
      message: "Error during ticket creation",
    });
  }

  // Actualizar stock

  inStock.forEach(async (product) => {
    let newStock = product.stock - product.quantity;
    let operation = ProductService.updateStock(product.id, newStock);

    if (!operation) {
      return handleError(null, res);
    }
  });

  //Limpiar Carrito

  await CartService.clearCart(purchaserCart);

  //Enviar Ticket al Usuario

  res.status(201).json({
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
