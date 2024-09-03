import { ProductService } from "../services/services.js";
import { makeid } from "../utils.js";
import getErrorDetails from "../services/errorService.js";

//Defino Origin para busqueda de errores posteriormente

const origin = "product";

// Funcion para errores

async function handleError(error, res) {
  const { errorName, message, httpCode } = getErrorDetails(error, origin);
  return res.status(httpCode).json({ error: errorName, message });
}

// Const para Exportar

const create = async (req, res) => {
  const product = req.body;

  if (!product.title || !product.description || !product.price) {
    return res
      .status(400)
      .json({ status: "error", error: "Incomplete values" });
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
      .json({ status: "error", error: "Price isn't a number" });
  }

  if (
    typeof newProduct.stock !== "number" ||
    isNaN(newProduct.stock) ||
    newProduct.stock < 0
  ) {
    return res.status(400).json({
      status: "error",
      error: "Stock isn't a number or is a negative value",
    });
  }

  if (typeof newProduct.status !== "boolean") {
    return res
      .status(400)
      .json({ status: "error", error: "Status isn't true or false" });
  }

  if (typeof newProduct.category !== "string") {
    return res
      .status(400)
      .json({ status: "error", error: "Category isn't a Text" });
  }

  // Usuario envió todo OK se procede a crear el producto

  const productResult = await ProductService.createProduct(newProduct);

  if (!productResult) {
    return await handleError(-1, res);
  }

  // Producto creado

  res.json({ status: "success", message: "Product Created", product: product });
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

  if (!products) {
    return await handleError(null, res);
  }

  return res
    .status(200)
    .json({ status: "success", payload: products, pagination });
};

const getById = async (req, res) => {
  const product = req.product;
  res.json({ status: "success", payload: product });
};

const update = async (req, res) => {
  const productId = req.params.pid;

  const updatedValues = req.body;

  if (typeof updatedValues.title !== "string") {
    return res
      .status(400)
      .json({ status: "error", error: "Title isn't a Text" });
  }

  if (typeof updatedValues.description !== "string") {
    return res
      .status(400)
      .json({ status: "error", error: "Description isn't a Text" });
  }

  if (typeof updatedValues.code !== "string") {
    return res
      .status(400)
      .json({ status: "error", error: "Code isn't a Text" });
  }

  if (typeof updatedValues.price !== "number" || isNaN(updatedValues.price)) {
    return res
      .status(400)
      .json({ status: "error", error: "Price isn't a number" });
  }

  if (
    typeof updatedValues.stock !== "number" ||
    isNaN(updatedValues.stock) ||
    updatedValues.stock < 0
  ) {
    return res.status(400).json({
      status: "error",
      error: "Stock isn't a number or is a negative value",
    });
  }

  if (typeof updatedValues.status !== "boolean") {
    return res
      .status(400)
      .json({ status: "error", error: "Status isn't true or false" });
  }

  if (typeof updatedValues.category !== "string") {
    return res
      .status(400)
      .json({ status: "error", error: "Category isn't a Text" });
  }

  const foundProduct = req.product;

  await ProductService.updateById({ _id: productId }, { $set: updatedValues });

  res.json({
    status: "success",
    payload: { oldValues: foundProduct, newValues: updatedValues },
  });
};

const deleteById = async (req, res) => {
  const productId = req.params.id;

  const products = await ProductService.getAllProducts();

  if (products == null) {
    return await handleError(null, res);
  }

  const foundProduct = await ProductService.getProductById(productId);

  if (foundProduct == null) {
    return await handleError(-2, res);
  }

  await ProductService.deleteProduct(productId);

  res.json({
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
