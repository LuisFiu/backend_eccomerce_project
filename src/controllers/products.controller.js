import { ProductService } from "../services/services.js";
import productModel from "../db/mongo/models/product.model.js";
import { makeid } from "../utils.js";
import getErrorDetails from "../services/errorService.js";

//Defino Origin para busqueda de errores posteriormente

const origin = "product";

// Funciones para Base Router

const create = async (req, res) => {
  const product = req.body;

  if (!product.title || !product.description || !product.price) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  const newProduct = {
    title: product.title,
    description: product.description,
    code: `${product.title.replace(/\s+/g, "")}_${makeid(6)}`,
    price: product.price,
    status: product.status,
    stock: product.stock,
    category: product.category,
  };

  if (typeof newProduct.price !== "number" || isNaN(newProduct.price)) {
    return res
      .status(400)
      .send({ status: "error", error: "Price isn't a number" });
  }

  if (newProduct.stock == null) {
    newProduct.stock = 1;
  } else {
    if (
      typeof newProduct.stock !== "number" ||
      isNaN(newProduct.stock) ||
      newProduct.stock < 0
    ) {
      return res.status(400).send({
        status: "error",
        error: "Stock isn't a number or is a negative value",
      });
    }
  }

  if (newProduct.status == null) {
    newProduct.status = true;
  } else {
    if (typeof newProduct.status !== "boolean") {
      return res
        .status(400)
        .send({ status: "error", error: "Status isn't true or false" });
    }
  }

  if (newProduct.category == null) {
    newProduct.category = "Generic";
  } else {
    if (typeof newProduct.category !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Category isn't a Text" });
    }
  }

  // Usuario envió todo OK se procede a crear el producto

  const productResult = await ProductService.createProduct(newProduct);

  if (!productResult === null) {
    operationResult = -1;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  // Producto creado

  res.send({ status: "success", message: "Product Created", product: product });
};

const get = async (req, res) => {
  const paginationData = await ProductService.getPaginatedProducts(
    req.params.page
  );

  const {
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    page: currentPage,
  } = paginationData;

  let prevLink = `?page=${paginationData.prevPage}`;

  let nextLink = `?page=${paginationData.nextPage}`;

  if (paginationData.hasPrevPage === false) {
    prevLink = null;
  }

  if (paginationData.hasNextPage === false) {
    nextLink = null;
  }

  const pagination = {
    totalPages: paginationData.totalPages,
    prevPage: paginationData.prevPage,
    nextPage: paginationData.nextPage,
    page: paginationData.page,
    hasPrevPage: paginationData.hasPrevPage,
    hasNextPage: paginationData.hasNextPage,
    prevLink: prevLink,
    nextLink: nextLink,
  };

  const products = paginationData.docs;

  if (products < 0 || null) {
    const { errorName, httpCode, message } = getErrorDetails(result, origin);
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  return res
    .status(200)
    .send({ status: "success", payload: products, pagination });
};

const getById = async (req, res) => {
  let operationResult;

  const productId = req.params.id;

  const products = await ProductService.getAllProducts();

  if (products == null) {
    operationResult = null;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const foundProduct = await ProductService.getProductById(productId);

  if (foundProduct == null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  res.send({ status: "success", payload: foundProduct });
};

const update = async (req, res) => {
  let operationResult;

  const productId = req.params.id;

  const updatedValues = req.body;

  if (updatedValues.title == null) {
  } else {
    if (typeof updatedValues.title !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Title isn't a Text" });
    }
  }
  if (typeof updatedValues.price !== "number" || isNaN(updatedValues.price)) {
    return res
      .status(400)
      .send({ status: "error", error: "Price isn't a number" });
  }

  if (updatedValues.stock == null) {
  } else {
    if (
      typeof updatedValues.stock !== "number" ||
      isNaN(updatedValues.stock) ||
      updatedValues.stock < 0
    ) {
      return res.status(400).send({
        status: "error",
        error: "Stock isn't a number or is a negative value",
      });
    }
  }

  if (updatedValues.status == null) {
  } else {
    if (typeof updatedValues.status !== "boolean") {
      return res
        .status(400)
        .send({ status: "error", error: "Status isn't true or false" });
    }
  }

  if (updatedValues.category == null) {
  } else {
    if (typeof updatedValues.category !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Category isn't a Text" });
    }
  }

  const foundProduct = await ProductService.getProductById(productId);

  if (foundProduct == null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  await ProductService.updateById({ _id: productId }, { $set: updatedValues });

  res.send({
    status: "success",
    payload: { oldValues: foundProduct, newValues: updatedValues },
  });
};

const deleteById = async (req, res) => {
  let operationResult;

  const productId = req.params.id;

  const parsedProductId = parseInt(productId, 10);

  if (isNaN(parsedProductId)) {
    return res
      .status(400)
      .send({ status: "error", message: "Please send a valid Product ID" });
  }

  const products = await ProductService.getAllProducts();

  if (products == null) {
    operationResult = null;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  const foundProduct = await ProductService.getProductById(productId);

  if (foundProduct == null) {
    operationResult = -2;

    const { errorName, httpCode, message } = getErrorDetails(
      operationResult,
      origin
    );
    return res
      .status(httpCode)
      .send({ status: "error", error: errorName, message });
  }

  await ProductService.deleteProduct(productId);

  res.send({
    status: "success",
    message: "Product deleted successfully",
    payload: foundProduct,
  });
};

export default {
  create,
  get,
  getById,
  update,
  deleteById,
};
